const {
	UserInputError,
	AuthenticationError,
	ForbiddenError,
	withFilter,
} = require("apollo-server");
const { Op } = require("sequelize");
const { Message, User, Reaction } = require("../../models");

module.exports = {
	Query: {
		getMessages: async (parent, { from }, { user }) => {
			try {
				if (!user) throw new AuthenticationError("Unauthenticated.");

				const otherUser = await User.findOne({
					where: { username: from },
				});

				if (!otherUser) throw new UserInputError("User not found.");

				const usernames = [user.username, otherUser.username];

				const messages = await Message.findAll({
					where: {
						from: { [Op.in]: usernames },
						to: { [Op.in]: usernames },
					},
					order: [["createdAt", "ASC"]],
					include: [{ model: Reaction, as: "reactions" }],
				});

				return messages;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
	},
	Mutation: {
		sendMessage: async (parent, { to, content }, { user, pubsub }) => {
			try {
				console.log(user);
				if (!user) throw new AuthenticationError("Unauthenticated.");

				const recipient = await User.findOne({
					where: { username: to },
				});

				if (!recipient) throw new UserInputError("User not found.");

				if (content.trim() === "")
					throw new UserInputError("Message is empty");
				else if (recipient.username === user.username)
					throw new UserInputError("Can't message yourself.");

				const message = await Message.create({
					from: user.username,
					to,
					content,
				});

				// Trigger the subscription
				pubsub.publish("NEW_MESSAGE", { newMessage: message });

				return message;
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
					console.log("USER",user)
					if (!user)
						throw new AuthenticationError("Unauthenticated.");
					return pubsub.asyncIterator("NEW_MESSAGE");
				},
				({ newMessage }, __, { user }) => {
					// Check if the username is the subscriptor
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
					return (
						message.from === user.username ||
						message.to === user.username
					);
				}
			),
		},
	},
};
