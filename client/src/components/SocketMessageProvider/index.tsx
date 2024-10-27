import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import socket from "../../socket";
import {
	isServerUsers,
	type ServerUser,
	type LocalUser,
	isServerUserMessage,
	type Session,
} from "./types";

export const SocketMessageContext = createContext<{
	user: LocalUser | null;
	users: LocalUser[];
	authorizeUser: (username: string) => void;
	sendMessage: (message: { activeChatId: string; message: string }) => void;
} | null>(null);

const initLocalUser = (user: ServerUser): LocalUser => ({
	...user,
	isSelf: user.userId === socket.data?.userId,
	isConnected: true,
	messages: (user.messages || []).map((msg) => ({
		...msg,
		isFromSelf: msg.from === socket.data?.userId,
	})),
	hasNewMessages: false,
});

const SocketMessageProvider = ({ children }: PropsWithChildren) => {
	const [users, setUsers] = useState<LocalUser[]>([]);

	const user = useMemo(
		() => users.find((user) => user.isSelf) || null,
		[users],
	);

	// try to load existing session for sessionStorage
	useEffect(() => {
		const sessionId = sessionStorage.getItem("sessionId");
		if (sessionId) {
			socket.auth = { sessionId };
			socket.connect();
		}
	}, []);

	useEffect(() => {
		const onConnect = () => {
			setUsers((previous) => {
				const currentUser = previous.find((user) => user.isSelf);
				if (!currentUser) {
					return previous;
				}

				// update the user's connection status
				currentUser.isConnected = true;
				return [...previous];
			});
		};

		const onDisconnect = () => {
			setUsers((previous) => {
				const currentUser = previous.find((user) => user.isSelf);
				if (!currentUser) {
					return previous;
				}

				// update the user's connection status
				currentUser.isConnected = false;
				return [...previous];
			});
		};

		const onConnectError = (err: Error) => {
			if (err.message === "invalid username") {
				// reset users state
				setUsers([]);
			}
		};

		const onSession = ({ sessionId, userId }: Session) => {
			socket.auth = { sessionId, userId };
			sessionStorage.setItem("sessionId", sessionId);
			if (!socket.data) {
				socket.data = {};
			}
			socket.data.userId = userId;
		};

		// on new user connected (including self)
		const onUsers = (users: unknown) => {
			if (!isServerUsers(users)) {
				// TODO - DEBUG - log invalid messages
				console.error("Invalid users", users);
				return;
			}

			const localUsers = users
				.map(initLocalUser)
				// current user first, then sorted by username
				.sort((a, b) => {
					if (a.isSelf) return -1;
					if (b.isSelf) return 1;
					if (a.username < b.username) return -1;
					return a.username > b.username ? 1 : 0;
				});

			setUsers(localUsers);
		};

		const onNewUserConnected = (user: ServerUser) => {
			const localUser = initLocalUser(user);
			setUsers((previous) => [...previous, localUser]);
		};

		const onUserDisconnected = (userId: string) => {
			setUsers((previous) => {
				const user = previous.find((user) => user.userId === userId);
				if (!user) {
					return previous;
				}

				user.isConnected = false;

				return [...previous];
			});
		};

		const onPrivateMessage = (message: unknown) => {
			if (!isServerUserMessage(message)) {
				console.error("Invalid private message", message);
				return;
			}

			const { from, msg } = message;

			const updatedUsers = users.map((user) => {
				if (user.userId === from) {
					user.messages.push({
						msg,
						isFromSelf: false,
					});
					// TODO - handle new message icon
					// if (user !== this.selectedUser) {
					// 	user.hasNewMessages = true;
					// }
				}

				return user;
			});

			setUsers(updatedUsers);
		};

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("connect_error", onConnectError);
		socket.on("session", onSession);

		socket.on("users", onUsers);
		socket.on("user_connected", onNewUserConnected);
		socket.on("user_disconnected", onUserDisconnected);

		socket.on("private_message", onPrivateMessage);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("connect_error", onConnectError);
			socket.on("session", onSession);

			socket.off("users", onUsers);
			socket.off("user_connected", onNewUserConnected);
			socket.off("user_disconnected", onUserDisconnected);

			socket.off("private_message", onPrivateMessage);
		};
	}, [users]);

	const authorizeUser = useCallback((username: string) => {
		if (username) {
			socket.auth = { username };
			socket.connect();
		}
	}, []);

	const sendMessage = useCallback(
		({ activeChatId, message }: { activeChatId: string; message: string }) => {
			if (!message || !user) return;

			socket.emit("private_message", {
				msg: message,
				to: activeChatId,
			});

			// messages are not broadcasted back to the sending client
			// so we manually add the message to the list
			const updatedUsers = users.map((user) => {
				if (user.userId === activeChatId) {
					user.messages.push({
						msg: message,
						isFromSelf: true,
					});
				}

				return user;
			});

			setUsers(updatedUsers);
		},
		[user, users],
	);

	return (
		<SocketMessageContext.Provider
			value={{
				user,
				users,
				authorizeUser,
				sendMessage,
			}}
		>
			{children}
		</SocketMessageContext.Provider>
	);
};

export default SocketMessageProvider;
