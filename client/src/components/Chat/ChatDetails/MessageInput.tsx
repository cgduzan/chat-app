import React, { useCallback, useState } from "react";

import useSocketMessageContext from "../../SocketMessageProvider/useSocketMessageContext";

type Props = {
	activeChatId: string;
};

const MessageInput = ({ activeChatId }: Props) => {
	const { sendMessage: sendMessageToServer } = useSocketMessageContext();
	const [message, setMessage] = useState("");

	const sendMessage = useCallback(() => {
		if (!message) return;

		sendMessageToServer({ activeChatId, message });
		setMessage("");
	}, [activeChatId, message, sendMessageToServer]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			// handle ctrl+enter OR cmd+enter key press
			if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
				sendMessage();
				return;
			}
		},
		[sendMessage],
	);

	return (
		<div id="message-input">
			<textarea
				value={message}
				onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
					setMessage(e.target.value)
				}
				onKeyDown={handleKeyDown}
				placeholder="Type a message..."
			/>
			<div id={"button-container"}>
				<button type={"button"} onClick={sendMessage}>
					Send
				</button>
			</div>
		</div>
	);
};

export default React.memo(MessageInput);
