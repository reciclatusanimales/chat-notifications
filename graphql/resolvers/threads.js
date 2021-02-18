const { Op, ValidationError } = require("sequelize");
const { UserInputError, AuthenticationError } = require("apollo-server");

const { User, Thread, Message } = require("../../models");
const { capitalize } = require("../../utils/utils");

module.exports = {
	Query: {
		getThreads: async (_, __, { user }) => {
			console.log("GET THREADS");
			try {
				if (!user) throw new AuthenticationError("Unauthenticated");

				let userThreads = await User.findOne({
					where: { username: user.username },
					include: [
						{
							model: Thread,
							as: "threads",
							include: [
								{
									model: User,
									as: "users",
								},
							],
						},
					],
				});

				const allUserMessages = await Message.findAll({
					where: {
						[Op.or]: [
							{ from: user.username },
							{ to: user.username },
						],
					},
					order: [["createdAt", "DESC"]],
				});

				userThreads.threads = userThreads.threads.map((thread) => {
					const otherUser = thread.users.find(
						(u) => u.username !== user.username
					);
					thread.user = otherUser;

					const latestMessage = allUserMessages.find(
						(m) =>
							m.from === otherUser.username ||
							m.to === otherUser.username
					);
					thread.latestMessage = latestMessage;
					return thread;
				});

				return userThreads.threads;
			} catch (error) {
				throw error;
			}
		},
	},
};
