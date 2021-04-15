import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import jwt from "jwt-decode";

import "./styles/app.css";
import ApolloProvider from "./ApolloProvider";

// Pages
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";

import DynamicRoute from "./utils/DynamicRoute";

import { useDispatch } from "react-redux";
import { login } from "./features/user/userSlice";

let user = null;
const token = localStorage.getItem("token");

if (token) {
	const decodedToken = jwt(token);
	const expiresAt = new Date(decodedToken.exp * 1000);

	if (new Date() > expiresAt) {
		localStorage.removeItem("token");
	} else {
		user = { ...decodedToken, token };
	}
} else {
	console.log("NO TOKEN");
}

function App() {
	const dispatch = useDispatch();
	if (user) dispatch(login(user));

	return (
		<ApolloProvider>
			<BrowserRouter>
				<div className="h-full">
					<Switch>
						<DynamicRoute
							exact
							path="/"
							component={Home}
							authenticated
						/>
						<DynamicRoute
							path="/register"
							component={Register}
							guest
						/>
						<DynamicRoute path="/login" component={Login} guest />
					</Switch>
				</div>
			</BrowserRouter>
		</ApolloProvider>
	);
}

export default App;
