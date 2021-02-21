const { gql } = require("apollo-server");

module.exports = gql`
	type User {
		username: String!
		email: String
		createdAt: String!
		token: String
		imageUrn: String
		imageUrl: String
		threads: [Thread]
		latestMessage: Message
	}
	type Message {
		uuid: String!
		content: String!
		from: String!
		to: String
		user: User!
		threadId: String!
		thread: Thread
		threadd: Thread
		users: [User]
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
		value: String
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
	type Thread {
		id: String!
		users: [User]!
		user: User
		lastMessage: String
		unread: Int!
		createdAt: String!
		updatedAt: String!
	}
	type Query {
		getUsers: [User]!
		login(username: String!, password: String!): User!
		getMessages(threadId: Int!): [Message]!
		getNotifications: [Notification]!
		getThreads: [Thread]!
	}
	type Mutation {
		register(
			username: String!
			email: String!
			password: String!
			confirmPassword: String!
		): User!
		sendMessage(threadId: Int, username: String, content: String!): Message!
		reactToMessage(uuid: String!, content: String!): Reaction!
		createNotification(
			username: String!
			type: String!
			value: String
			sendername: String
			subName: String
			postId: Int
			commentId: Int
		): Notification!
	}
	type Subscription {
		newMessage: Message!
		newReaction: Reaction!
		newNotification: Notification!
	}
`;
