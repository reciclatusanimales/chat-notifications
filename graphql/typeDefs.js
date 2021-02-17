const { gql } = require("apollo-server");

module.exports = gql`
	type User {
		username: String!
		email: String
		createdAt: String!
		token: String
		imageUrn: String
		imageUrl: String
		latestMessage: Message
	}
	type Message {
		uuid: String!
		content: String!
		from: String!
		to: String!
		createdAt: String!
		reactions: [Reaction]
	}
	type Sub {
		name: String!
		title: String!
		imageUrn: String
		imageUrl: String
		description: String
		username: String!
		createdAt: String!
	}
	type Post {
		identifier: String!
		slug: String!
		title: String!
		body: String
		subName: String!
		username: String!
		createdAt: String!
	}
	type Comment {
		identifier: String!
		body: String!
		username: String!
		createdAt: String!
	}
	type Notification {
		identifier: String!
		type: String!
		read: String!
		user: User!
		sender: User
		sub: Sub
		post: Post
		comment: Comment
		createdAt: String!
	}
	type Reaction {
		uuid: String!
		content: String!
		createdAt: String!
		message: Message!
		user: User!
	}
	type Query {
		getUsers: [User]!
		login(username: String!, password: String!): User!
		getMessages(from: String!): [Message]!
		getNotifications: [Notification]!
	}
	type Mutation {
		register(
			username: String!
			email: String!
			password: String!
			confirmPassword: String!
		): User!
		sendMessage(to: String!, content: String!): Message!
		reactToMessage(uuid: String!, content: String!): Reaction!
		createNotification(
			username: String!
			sendername: String!
			type: String!
		): Notification!
	}
	type Subscription {
		newMessage: Message!
		newReaction: Reaction!
		newNotification: Notification!
	}
`;
