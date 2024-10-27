import { Session } from "./types";

type SessionId = string;

export class InMemorySessionStore {
  #sessions: Map<SessionId, Session>;

  constructor() {
    this.#sessions = new Map<SessionId, Session>();
  }

  findSession(id: string) {
    return this.#sessions.get(id);
  }

  saveSession(id: string, session: Session) {
    this.#sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.#sessions.values()];
  }
}
