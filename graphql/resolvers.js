const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { UserInputError, AuthenticationError } = require("apollo-server");

const { JWT_SECRET } = require("../config/env.json");
const { User } = require("../models");

module.exports = {
	Query: {
		getUsers: async (_, __, context) => {
			try {
				let user;
				if (context.req && context.req.headers.authorization) {
					const token = context.req.headers.authorization.split(
						"Bearer "
					)[1];

					jwt.verify(token, JWT_SECRET, (error, decodedToken) => {
						if (error) {
							throw new AuthenticationError("Unauthenticated.");
						}
						user = decodedToken;
					});
				}

				const users = await User.findAll({
					where: { username: { [Op.ne]: user.username } },
				});

				return users;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		login: async (_, args) => {
			const { username, password } = args;
			let errors = {};

			try {
				if (username.trim() === "") {
					errors.username = "Username must not be empty.";
				}
				if (password === "") {
					errors.password = "Password must not be empty.";
				}

				console.log(errors);

				if (Object.keys(errors).length > 0) {
					throw new UserInputError("Bad input", { errors });
				}

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
					throw new AuthenticationError("Incorrect password", {
						errors,
					});
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
					createdAt: user.createdAt.toISOString(),
					token,
				};
			} catch (error) {
				console.error(error);
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
				if (username.trim() === "") {
					errors.username = "Username must not be empty.";
				}
				if (email.trim() === "") {
					errors.email = "Email must not be empty.";
				}
				if (password.trim() === "") {
					errors.password = "Password must not be empty.";
				}
				if (confirmPassword.trim() === "") {
					errors.confirmPassword =
						"Confirmation password must not be empty.";
				}
				if (password !== confirmPassword) {
					errors.confirmPassword = "Password must match.";
				}

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

				if (Object.keys(errors).length > 0) {
					console.error(errors);
					throw errors;
				}

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
					error.errors.username = "Username or Email already taken.";
				} else if (error.name === "SequelizeValidationError") {
					error.errors.forEach((e) => (errors[e.path] = e.message));
				}
				throw new UserInputError("Bad input", { errors: error });
			}
		},
	},
};
