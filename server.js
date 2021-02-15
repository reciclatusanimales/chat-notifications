const http = require('http');
const express = require('express');
const PORT = 4000
const { ApolloServer } = require('apollo-server-express');

require("dotenv").config();

const { sequelize } = require("./models");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const contextMiddleware = require("./utils/contextMiddleware");

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: contextMiddleware,
	subscriptions: {
		path: "/graphql",
	},
});
const app = express();

server.applyMiddleware({app})
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () =>{
	console.log(`🚀 Server ready at http://localhost:${PORT}`);
	console.log(`🚀 Subscriptions ready at http://localhost:${PORT}`);

	sequelize
	.authenticate()
	.then(() => {
		console.log("Database connected.");
	})
	.catch((error) => {
		console.error(error);
	});
})