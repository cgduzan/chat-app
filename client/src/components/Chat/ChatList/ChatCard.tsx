import React, { useCallback } from "react";

import type { LocalUser } from "../../SocketMessageProvider/types";

type Props = {
	user: LocalUser;
	isSelected: boolean;
	onCardClicked: () => void;
};

const ChatCard = ({ user, isSelected, onCardClicked }: Props) => {
	const { username, isConnected } = user;

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (event.key === "Enter" || event.key === "Space") {
				onCardClicked();
			}
		},
		[onCardClicked],
	);

	const cardClass = isSelected ? "chat-card selected" : "chat-card";
	const iconClass = isConnected ? "status-icon connected" : "status-icon";

	return (
		<div
			className={cardClass}
			onClick={onCardClicked}
			onKeyDown={handleKeyDown}
		>
			<p className={"title"}>{username}</p>
			<div className={"status-container"}>
				<i className={iconClass} />
				<p>{isConnected ? "Online" : "Offline"}</p>
			</div>
		</div>
	);
};

export default React.memo(ChatCard);
