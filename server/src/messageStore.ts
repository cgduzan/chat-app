import { Message } from "./types";

export class InMemoryMessageStore {
  #messages: Message[];

  constructor() {
    this.#messages = [];
  }

  saveMessage(message: Message) {
    this.#messages.push(message);
  }

  findMessagesForUser(userId: string) {
    return this.#messages.filter(
      ({ from, to }) => from === userId || to === userId
    );
  }

  // TODO - for DEBUGGING only
  findAllMessages() {
    return this.#messages;
  }
}
