import React from "react";
import "./App.scss";
import { BrowserRouter, Switch } from "react-router-dom";

import { Container } from "react-bootstrap";
import ApolloProvider from "./ApolloProvider";

// Pages
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";

import { AuthProvider } from "./context/auth";
import { MessageProvider } from "./context/message";
import DynamicRoute from "./utils/DynamicRoute";

function App() {
	return (
		<ApolloProvider>
			<AuthProvider>
				<MessageProvider>
					<BrowserRouter>
						<Container className="pt-5">
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
								<DynamicRoute
									path="/login"
									component={Login}
									guest
								/>
							</Switch>
						</Container>
					</BrowserRouter>
				</MessageProvider>
			</AuthProvider>
		</ApolloProvider>
	);
}

export default App;
