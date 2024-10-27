import React from "react";

import ChatCard from "./ChatCard";

import "./ChatList.css";
import type { LocalUser } from "../../SocketMessageProvider/types";

type Props = {
	users: LocalUser[];
	activeChatId: string | null;
	onChatSelected: (userId: string) => void;
};

const ChatList = ({ users, activeChatId, onChatSelected }: Props) => {
	return (
		<div id={"chat-list"}>
			{users.map((user) => (
				<ChatCard
					key={user.userId}
					user={user}
					isSelected={activeChatId === user.userId}
					onCardClicked={() => {
						onChatSelected(user.userId);
					}}
				/>
			))}
		</div>
	);
};

export default React.memo(ChatList);
