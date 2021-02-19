const {
	UserInputError,
	AuthenticationError,
	ForbiddenError,
	withFilter,
} = require("apollo-server");
const { Op } = require("sequelize");
const { Thread, Message, User, Reaction, sequelize } = require("../../models");

module.exports = {
	Query: {
		getMessages: async (parent, { threadId }, { user }) => {
			try {
				if (!user) throw new AuthenticationError("Unauthenticated.");

				const messages = await Message.findAll({
					where: {
						threadId,
					},
					order: [["createdAt", "DESC"]],
					include: [
						{ model: Reaction, as: "reactions" },
						{ model: User, as: "user" },
					],
				});

				return messages;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
	},
	Mutation: {
		sendMessage: async (
			parent,
			{ threadId, content },
			{ user, pubsub }
		) => {
			try {
				if (!user) throw new AuthenticationError("Unauthenticated.");

				if (content.trim() === "")
					throw new UserInputError("El mensaje no puede estar vacío");

				const message = await Message.create({
					from: user.username,
					content,
					threadId,
				});

				const m = await Message.findOne({
					where: { id: message.id },
					attributes: {
						include: [
							[
								sequelize.literal(`(
									SELECT "username"
									FROM threads_users											
									WHERE "username" <> '${user.username}'
									AND "threadId"=${message.threadId}
									LIMIT 1
								)`),
								"to",
							],
						],
					},
					include: [
						{
							model: User,
							as: "user",
						},
						{ model: Reaction, as: "reactions" },
						{
							model: Thread,
							as: "thread",
							include: [
								{
									model: User,
									as: "users",
								},
							],
						},
					],
				});

				const formatedMessage = {
					uuid: m.uuid,
					content: m.content,
					from: m.from,
					to: m.dataValues.to,
					threadId: m.threadId,
					user: m.user,
					thread: m.thread,
					users: m.thread.dataValues.users,
					createdAt: m.createdAt,
					reactions: m.reactions,
				};
				console.log(formatedMessage);
				// Trigger the subscription
				pubsub.publish("NEW_MESSAGE", { newMessage: formatedMessage });

				return m;
			} catch (error) {
				throw error;
			}
		},
		reactToMessage: async (_, { uuid, content }, { user, pubsub }) => {
			const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];

			try {
				if (!reactions.includes(content)) {
					throw new UserInputError("Invalid reaction.");
				}

				const username = user ? user.username : "";
				user = await User.findOne({ where: { username } });

				if (!user) throw new AuthenticationError("Unauthenticated.");

				const message = await Message.findOne({ where: { uuid } });

				if (!message) throw new UserInputError("Message not found.");

				if (
					message.from !== user.username &&
					message.to !== user.username
				)
					throw new ForbiddenError("Unauthorized.");

				let reaction = await Reaction.findOne({
					where: { messageId: message.id, userId: user.id },
				});

				if (reaction) {
					reaction.content = content;
				} else {
					reaction = await Reaction.create({
						messageId: message.id,
						userId: user.id,
						content,
					});
				}

				await reaction.save();

				pubsub.publish("NEW_REACTION", { newReaction: reaction });

				return reaction;
			} catch (error) {
				throw error;
			}
		},
	},
	Subscription: {
		newMessage: {
			subscribe: withFilter(
				(_, __, { user, pubsub }) => {
					if (!user)
						throw new AuthenticationError("Unauthenticated.");
					return pubsub.asyncIterator("NEW_MESSAGE");
				},
				async ({ newMessage }, __, { user }) => {
					return (
						newMessage.from === user.username ||
						newMessage.to === user.username
					);
				}
			),
		},
		newReaction: {
			subscribe: withFilter(
				(_, __, { user, pubsub }) => {
					if (!user)
						throw new AuthenticationError("Unauthenticated.");
					return pubsub.asyncIterator("NEW_REACTION");
				},
				async ({ newReaction }, __, { user }) => {
					// Check if the username is the subscriptor
					const message = await newReaction.getMessage();
					return message.from === user.username;
				}
			),
		},
	},
};
