import React, { useMemo, useState } from "react";

import useSocketMessageContext from "../SocketMessageProvider/useSocketMessageContext";
import ChatList from "./ChatList";
import ChatDetails from "./ChatDetails";
import "./Chat.css";

const Chat = () => {
	const { users } = useSocketMessageContext();

	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

	const activeChatUser = useMemo(() => {
		return users.find((user) => user.userId === selectedUserId) || null;
	}, [selectedUserId, users]);

	// check if mobile view
	const isMobile = window.innerWidth < 768;
	const canViewList = !isMobile || !selectedUserId;
	const canViewDetails = !isMobile || selectedUserId;

	return (
		<div id={"chat-container"}>
			{canViewList && (
				<ChatList
					users={users}
					activeChatId={selectedUserId}
					onChatSelected={setSelectedUserId}
				/>
			)}
			{canViewDetails && (
				<ChatDetails
					activeChatUser={activeChatUser}
					onCloseChatDetails={() => {
						setSelectedUserId(null);
					}}
				/>
			)}
		</div>
	);
};

export default React.memo(Chat);
