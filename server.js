const { ApolloServer } = require("apollo-server");

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
		path: "/",
	},
});

server.listen().then(({ url, subscriptionsUrl }) => {
	console.log(`🚀 Server ready at ${url}`);
	console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);

	sequelize
		.authenticate()
		.then(() => {
			console.log("Database connected.");
		})
		.catch((error) => {
			console.error(error);
		});
});
