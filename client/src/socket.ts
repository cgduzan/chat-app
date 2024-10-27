import { io, type Socket } from "socket.io-client";

console.log("node env", process.env.NODE_ENV);

// "undefined" means the URL will be computed from the `window.location` object
const URL =
	process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

const socket = io(URL, {
	autoConnect: false,
}) as Socket & { data?: { userId?: string } };

// TODO - DEBUG - to see all the events
socket.onAny((event, ...args) => {
	console.log(`DEBUG - ${event}`, args);
});

export default socket;
