import React, { useMemo } from "react";

import useSocketMessageContext from "../../SocketMessageProvider/useSocketMessageContext";

type Props = {
	activeChatId: string;
};

const MessageTimeline = ({ activeChatId }: Props) => {
	const { users } = useSocketMessageContext();

	const [user, messages] = useMemo(() => {
		const activeUserChat = users.find((user) => user.userId === activeChatId);

		return [activeUserChat, activeUserChat?.messages || []];
	}, [activeChatId, users]);

	return (
		<div id={"message-timeline"}>
			{messages.map(({ msg, isFromSelf }) => {
				return (
					<div key={msg} className={`message ${isFromSelf ? "self" : ""}`}>
						{!isFromSelf && (
							<p className={"username"}>{user?.username || "Unknown"}</p>
						)}
						<p>{msg}</p>
					</div>
				);
			})}
		</div>
	);
};

export default React.memo(MessageTimeline);
