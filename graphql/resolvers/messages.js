const { UserInputError, AuthenticationError } = require("apollo-server");
const { Op } = require("sequelize");
const { Message, User } = require("../../models");

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
					order: [["createdAt", "DESC"]],
				});

				return messages;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
	},
	Mutation: {
		sendMessage: async (parent, { to, content }, { user }) => {
			try {
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

				return message;
			} catch (error) {
				throw error;
			}
		},
	},
};
