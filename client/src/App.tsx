import React from "react";

import "./App.css";
import Chat from "./components/Chat";
import Login from "./components/Login";
import SocketMessageProvider from "./components/SocketMessageProvider";
import useSocketMessageContext from "./components/SocketMessageProvider/useSocketMessageContext";

const App = () => {
	const { user } = useSocketMessageContext();

	return <>{!user ? <Login /> : <Chat />}</>;
};

const AppContainer = () => {
	return (
		<SocketMessageProvider>
			<App />
		</SocketMessageProvider>
	);
};

export default React.memo(AppContainer);
