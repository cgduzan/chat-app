import React from "react";
import type { LocalUser } from "../../SocketMessageProvider/types";

type Props = {
	activeChatUser: LocalUser;
	onCloseChatDetails: () => void;
};

const ChatHeader = ({
	activeChatUser: { isConnected, username, isSelf },
	onCloseChatDetails,
}: Props) => {
	const iconClass = isConnected ? "status-icon connected" : "status-icon";
	return (
		<div id={"chat-header"}>
			<div id={"chat-header-content"}>
				<i className={iconClass} />
				<p>{`${username}${isSelf ? " (you)" : ""}`}</p>
			</div>
			<button type={"button"} onClick={onCloseChatDetails}>
				&times;
			</button>
		</div>
	);
};

export default React.memo(ChatHeader);
