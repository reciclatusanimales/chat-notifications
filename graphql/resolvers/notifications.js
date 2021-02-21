const {
	UserInputError,
	AuthenticationError,
	ForbiddenError,
	withFilter,
} = require("apollo-server");
const { Op } = require("sequelize");
const {
	Message,
	User,
	Sub,
	Post,
	Comment,
	Reaction,
	Notification,
} = require("../../models");

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
		createNotification: async (
			parent,
			{ username, type, value, sendername, subName, postId, commentId },
			{ user, pubsub }
		) => {
			try {
				const notification = await Notification.create({
					username,
					type,
					value,
					sendername,
					subName,
					postId,
					commentId,
				});

				pubsub.publish("NEW_NOTIFICATION", {
					newNotification: notification,
				});

				return notification;
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
