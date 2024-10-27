import React, { useState } from "react";

import useSocketMessageContext from "../SocketMessageProvider/useSocketMessageContext";

import "./Login.css";

const Login = () => {
	const { authorizeUser } = useSocketMessageContext();
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!username) {
			setError("Please enter a username");
			return;
		}

		// Do something with the username
		authorizeUser(username);
	};

	return (
		<div className="container">
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={username}
					onChange={handleUsernameChange}
					placeholder="Enter a username"
				/>
				<button type="submit">Submit</button>
				{error && <div>{error}</div>}
			</form>
		</div>
	);
};

export default React.memo(Login);
