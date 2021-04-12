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

<<<<<<< HEAD
const app = express();
app.use(cors());
app.use(jsonParser);

app.get("/api", (_, response) => response.send("Hello friend..."));

server.applyMiddleware({ app });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
	console.log(`🚀 Server ready at http://localhost:${PORT}`);
	console.log(`🚀 Subscriptions ready at http://localhost:${PORT}`);
=======
server.listen().then(({ url, subscriptionsUrl }) => {
	console.log(`🚀 Server ready at ${url}`);
	console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
>>>>>>> b310a3cfd58bdfd35a994837026cd1d149e1de0a

	sequelize
		.authenticate()
		.then(() => {
			console.log("Database connected.");
		})
		.catch((error) => {
			console.error(error);
		});
});
