const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op, ValidationError } = require("sequelize");
const { UserInputError, AuthenticationError } = require("apollo-server");

const { JWT_SECRET } = require("../../config/env.json");
const { User, Message } = require("../../models");
const { capitalize } = require("../../utils/utils");

module.exports = {
	Query: {
		getUsers: async (_, __, { user }) => {
			try {
				if (!user) throw new AuthenticationError("Unauthenticated");

				let users = await User.findAll({
					attributes: ["username", "imageUrl", "createdAt"],
					where: { username: { [Op.ne]: user.username } },
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

				users = users.map((otherUser) => {
					const latestMessage = allUserMessages.find(
						(m) =>
							m.from === otherUser.username ||
							m.to === otherUser.username
					);
					otherUser.latestMessage = latestMessage;
					return otherUser;
				});

				return users;
			} catch (error) {
				throw error;
			}
		},
		login: async (_, args) => {
			const { username, password } = args;
			let errors = {};

			try {
				if (username.trim() === "")
					errors.username = "Username must not be empty.";

				if (password === "")
					errors.password = "Password must not be empty.";

				if (Object.keys(errors).length > 0)
					throw new UserInputError("Bad input", { errors });

				const user = await User.findOne({
					where: { username },
				});

				if (!user) {
					errors.general = "Wrong credentials.";
					throw new UserInputError("User not found", { errors });
				}

				const correctPassword = await bcrypt.compare(
					password,
					user.password
				);

				if (!correctPassword) {
					errors.general = "Wrong credentials.";
					throw new UserInputError("Incorrect password", { errors });
				}

				const token = jwt.sign(
					{
						username,
					},
					JWT_SECRET,
					{ expiresIn: 60 * 60 }
				);

				return {
					...user.toJSON(),
					token,
				};
			} catch (error) {
				throw error;
			}
		},
	},
	Mutation: {
		register: async (_, args) => {
			let { username, email, password, confirmPassword } = args;
			let errors = {};

			try {
				// Validate input data
				if (username.trim() === "")
					errors.username = "Username must not be empty.";

				if (email.trim() === "")
					errors.email = "Email must not be empty.";

				if (password.trim() === "")
					errors.password = "Password must not be empty.";

				if (confirmPassword.trim() === "")
					errors.confirmPassword =
						"Confirmation password must not be empty.";

				if (password !== confirmPassword)
					errors.confirmPassword = "Password must match.";

				// Check if username and email exists
				// const userByUsername = await User.findOne({
				// 	where: { username },
				// });
				// const userByEmail = await User.findOne({
				// 	where: { email },
				// });

				// if (userByUsername) {
				// 	errors.username = "Username is taken.";
				// }
				// if (userByEmail) {
				// 	errors.email = "Email is taken.";
				// }

				if (Object.keys(errors).length > 0) throw errors;

				// Hash password
				password = await bcrypt.hash(password, 6);

				// Create user
				const user = await User.create({
					username,
					email,
					password,
				});

				// TODO: Return user
				return user;
			} catch (error) {
				if (error.name === "SequelizeUniqueConstraintError") {
					let path = error.original.constraint;
					path = path.split(error.original.table + "_");
					path = path[1].split("_key")[0];
					errors[path] = `${capitalize(path)} is already taken`;
				} else if (error.name === "SequelizeValidationError") {
					error.errors.forEach((e) => (errors[e.path] = e.message));
				}
				throw new UserInputError("Bad input", { errors });
			}
		},
	},
};
