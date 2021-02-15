import React from "react";

import {
	ApolloClient,
	InMemoryCache,
	createHttpLink,
	split,
	ApolloProvider as Provider,
} from "@apollo/client";

import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";

import { setContext } from "@apollo/client/link/context";

const uri = "/graphql/";
const host = window.location.host;
const wssUri = `wss://${host}/graphql/`;

let httpLink = createHttpLink({
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

httpLink = authLink.concat(httpLink);

const wsLink = new WebSocketLink({
	uri: wssUri,
	options: {
		reconnect: true,
		connectionParams: {
			Authorization: `Bearer ${localStorage.getItem("token")}`,
		},
	},
});

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === "OperationDefinition" &&
			definition.operation === "subscription"
		);
	},
	wsLink,
	httpLink
);

const client = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache(),
});

export default function ApolloProvider(props) {
	return <Provider client={client} {...props} />;
}
