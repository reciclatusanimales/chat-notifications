import React from "react";

import {
	ApolloClient,
	InMemoryCache,
	createHttpLink,
	ApolloProvider as Provider,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";

const uri = "http://localhost:4000";

const httpLink = createHttpLink({
	uri,
});

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem("token");

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

export default function ApolloProvider(props) {
	return <Provider client={client} {...props} />;
}
