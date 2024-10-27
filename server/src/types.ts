export type Message = {
  from: string;
  to: string;
  msg: string;
};

export type Session = {
  userId: string;
  username: string;
  isConnected: boolean;
  // messages: Message[];
};

export type SessionWithMessages = Session & { messages: Message[] };

export interface ServerToClientEvents {
  users: (users: SessionWithMessages[]) => void;
  user_connected: (user: { userId: string; username: string }) => void;
  user_disconnected: (userId: string) => void;
  session: (session: { sessionId: string; userId: string }) => void;
  chat_message: (message: { userId: string; msg: string }) => void;
  private_message: (message: { from: string; msg: string }) => void;
}

export interface ClientToServerEvents {
  chat_message: (msg: string) => void;
  private_message: (message: { to: string; msg: string }) => void;
}

// export interface InterServerEvents {}

export interface SocketData {
  sessionId: string;
  userId: string;
  username: string;
}
