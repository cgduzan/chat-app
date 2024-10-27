import { useContext } from "react";
import { SocketMessageContext } from ".";

const useSocketMessageContext = () => {
	const socketMessageContext = useContext(SocketMessageContext);
	if (socketMessageContext === null) {
		throw new Error(
			"useSocketMessage must be used within a SocketMessageProvider",
		);
	}
	return socketMessageContext;
};

export default useSocketMessageContext;
