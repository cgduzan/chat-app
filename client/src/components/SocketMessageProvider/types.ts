// -- Types --

export type Session = {
	sessionId: string;
	userId: string;
};

export type ServerUser = {
	userId: string;
	username: string;
	isConnected: boolean;
	messages: ServerUserMessage[];
};

export type LocalUser = Omit<ServerUser, "messages"> & {
	isSelf: boolean;
	messages: LocalUserMessage[];
	hasNewMessages: boolean;
};

export type ServerUserMessage = {
	from: string;
	msg: string;
};

export type LocalUserMessage = Omit<ServerUserMessage, "from"> & {
	isFromSelf: boolean;
};

// -- Type Guards --

const isServerUser = (user: unknown): user is ServerUser => {
	if (typeof user !== "object" || user === null) {
		return false;
	}

	const serverUser = user as ServerUser;

	return (
		typeof serverUser.userId === "string" &&
		typeof serverUser.username === "string" &&
		typeof serverUser.isConnected === "boolean"
	);
};

export const isServerUsers = (users: unknown): users is ServerUser[] => {
	if (!Array.isArray(users)) {
		return false;
	}

	return users.every(isServerUser);
};

export const isServerUserMessage = (
	message: unknown,
): message is ServerUserMessage => {
	if (typeof message !== "object" || message === null) {
		return false;
	}

	const userMessage = message as ServerUserMessage;

	return (
		typeof userMessage.from === "string" && typeof userMessage.msg === "string"
	);
};

// export const isUserMessage = (
// 	userMessage: unknown,
// ): userMessage is UserMessage => {
// 	if (typeof userMessage !== "object" || userMessage === null) {
// 		return false;
// 	}

// 	const message = userMessage as UserMessage;

// 	return typeof message.userId === "string" && typeof message.msg === "string";
// };
