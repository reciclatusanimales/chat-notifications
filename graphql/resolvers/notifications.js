const {
	UserInputError,
	AuthenticationError,
	ForbiddenError,
	withFilter,
} = require("apollo-server");
const { Op } = require("sequelize");
const { Message, User, Reaction, Notification } = require("../../models");

module.exports = {
	Query: {
		getNotifications: async (parent, __, { user }) => {
			try {
				if (!user) throw new AuthenticationError("Unauthenticated.");

				const notifications = await Notification.findAll({
					where: {
						username: user.username,
					},
					order: [["createdAt", "ASC"]],
				});

				return notifications;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
	},
	Mutation: {
		createNotification: async (parent, { username }, { user, pubsub }) => {
			try {
				console.log(user);
				console.log(username);

				const message = await Message.create({
					from: "tuto",
					to: "javieramena",
					content: "TRIGGERs",
				});

				pubsub.publish("NEW_NOTIFICATION", {
					newNotification: message,
				});

				return message;
			} catch (error) {
				throw error;
			}
		},
	},
	Subscription: {
		newNotification: {
			subscribe: withFilter(
				(_, __, { user, pubsub }) => {
					if (!user)
						throw new AuthenticationError("Unauthenticated.");
					return pubsub.asyncIterator("NEW_NOTIFICATION");
				},
				({ newNotification }, __, { user }) => {
					return newNotification.username === user.username;
				}
			),
		},
	},
};
