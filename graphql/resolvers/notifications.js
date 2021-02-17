const {
	UserInputError,
	AuthenticationError,
	ForbiddenError,
	withFilter,
} = require("apollo-server");
const { Op } = require("sequelize");
const { Message, User, Reaction, Notification } = require("../../models");

function makeId(length) {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}
	return result;
}

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
			{ username, sendername, type },
			{ user, pubsub }
		) => {
			try {
				if (type === "follow") {
					const notification = await Notification.create({
						identifier: makeId(8),
						type,
						sendername,
						username,
					});

					pubsub.publish("NEW_NOTIFICATION", {
						newNotification: notification,
					});

					return notification;
				}
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
