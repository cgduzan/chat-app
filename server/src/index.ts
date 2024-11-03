import "dotenv/config";
import { createServer } from "node:http";
import crypto from "node:crypto";
import { type DefaultEventsMap, Server } from "socket.io";

import type {
	ClientToServerEvents,
	Message,
	ServerToClientEvents,
	Session,
	SessionWithMessages,
	SocketData,
} from "./types";
import { InMemorySessionStore } from "./sessionStore";
import { InMemoryMessageStore } from "./messageStore";

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN?.split(",") || [];

const sessionStore = new InMemorySessionStore();
const messageStore = new InMemoryMessageStore();
const server = createServer();
const io = new Server<
	ClientToServerEvents,
	ServerToClientEvents,
	DefaultEventsMap,
	SocketData
>(server, {
	cors: {
		origin: ALLOWED_ORIGIN,
		// origin: "*",
	},
});

io.use((socket, next) => {
	// try to load session
	const sessionId = socket.handshake.auth.sessionId;
	if (sessionId) {
		const session = sessionStore.findSession(sessionId);
		if (session) {
			socket.data.sessionId = sessionId;
			socket.data.userId = session.userId;
			socket.data.username = session.username;

			return next();
		}
	}

	const username = socket.handshake.auth.username;
	if (!username) {
		return next(new Error("invalid username"));
	}
	socket.data.sessionId = crypto.randomUUID();
	socket.data.userId = crypto.randomUUID();
	socket.data.username = username;
	next();
});

// setup socket.io
io.on("connection", (socket) => {
	// persist session
	sessionStore.saveSession(socket.data.sessionId, {
		userId: socket.data.userId,
		username: socket.data.username,
		isConnected: true,
	});

	// emit session details
	socket.emit("session", {
		sessionId: socket.data.sessionId,
		userId: socket.data.userId,
	});

	// join the "userId" room
	socket.join(socket.data.userId);

	// fetch existing users & messages
	const users: SessionWithMessages[] = [];
	const messagesPerUser = new Map<string, Message[]>();
	for (const message of messageStore.findMessagesForUser(socket.data.userId)) {
		const { from, to } = message;
		const otherUser = socket.data.userId === from ? to : from;
		if (messagesPerUser.has(otherUser)) {
			messagesPerUser.get(otherUser)?.push(message);
		} else {
			messagesPerUser.set(otherUser, [message]);
		}
	}
	for (const session of sessionStore.findAllSessions()) {
		users.push({
			userId: session.userId,
			username: session.username,
			isConnected: session.isConnected,
			messages: messagesPerUser.get(session.userId) || [],
		});
	}

	socket.emit("users", users);

	// notify existing users
	socket.broadcast.emit("user_connected", {
		userId: socket.data.userId,
		username: socket.data.username,
	});

	// user connected
	console.log(`User ${socket.data.userId} connected`);

	// handle chat message events
	socket.on("private_message", async ({ to, msg }) => {
		// send private message to the specific user/chat
		console.log("received private message", { to, msg });

		const message = {
			msg,
			from: socket.data.userId,
			to,
		};
		socket.to(to).to(socket.data.userId).emit("private_message", message);

		// persist the message
		messageStore.saveMessage(message);
	});

	// // handle typing event
	// socket.on("typing", (isTyping) => {
	//   if (isTyping) {
	//     socket.broadcast.emit("typing", `User ${userId} is typing...`);
	//   } else {
	//     socket.broadcast.emit("typing", "");
	//   }
	// });

	socket.on("disconnect", async () => {
		console.log("user disconnected");

		const matchingSockets = await io.in(socket.data.userId).fetchSockets();
		const isDisconnected = matchingSockets.length === 0;
		if (isDisconnected) {
			// notify other users
			socket.broadcast.emit("user_disconnected", socket.data.userId);

			// update the connection status of the session
			sessionStore.saveSession(socket.data.sessionId, {
				userId: socket.data.userId,
				username: socket.data.username,
				isConnected: false,
			});
		}
	});
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
