const { Op, ValidationError } = require("sequelize");
const { UserInputError, AuthenticationError } = require("apollo-server");

const { User, Thread, Message, sequelize } = require("../../models");
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
							attributes: {
								include: [
									[
										sequelize.literal(`(
											SELECT message."content"
											FROM messages AS message											
											WHERE message."threadId"=threads.id
											ORDER BY message."createdAt" DESC
											LIMIT 1
										)`),
										"lastMessage",
									],
								],
							},
							include: [
								{
									model: User,
									as: "users",
								},
							],
						},
					],
				});

				const threads = userThreads.threads.map((t) => {
					const otherUser = t.users.find(
						(u) => u.username !== user.username
					);
					const formatedThread = {
						id: t.id,
						createdAt: t.createdAt,
						updatedAt: t.updatedAt,
						user: otherUser,
						lastMessage: t.dataValues.lastMessage,
					};
					return formatedThread;
				});

				return threads;
			} catch (error) {
				throw error;
			}
		},
	},
};
