import React from "react";
import ChatHeader from "./ChatHeader";
import MessageTimeline from "./MessageTimeline";
import MessageInput from "./MessageInput";
import type { LocalUser } from "../../SocketMessageProvider/types";

import "./ChatDetails.css";

type Props = {
	activeChatUser: LocalUser | null;
	onCloseChatDetails: () => void;
};

const EmptyChatDetails = () => {
	return <p className={"no-chat-selected"}>Select a chat to start messaging</p>;
};

const ChatDetails = ({ activeChatUser, onCloseChatDetails }: Props) => {
	return (
		<div id={"chat-details"}>
			{activeChatUser === null ? (
				<EmptyChatDetails />
			) : (
				<>
					<ChatHeader
						activeChatUser={activeChatUser}
						onCloseChatDetails={onCloseChatDetails}
					/>
					<div id={"chat-content-container"}>
						<MessageTimeline activeChatId={activeChatUser.userId} />
						<MessageInput activeChatId={activeChatUser.userId} />
					</div>
				</>
			)}
		</div>
	);
};

export default React.memo(ChatDetails);
