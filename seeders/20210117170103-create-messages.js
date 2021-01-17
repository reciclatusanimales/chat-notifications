"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.bulkCreate("messages", [
			{
				uuid: "7648485a-6657-48d7-87d6-6a98931d3598",
				content: "Are u ok?",
				from: "angela",
				to: "elliot",
				createdAt: "2021-01-17 07:00:00",
				updatedAt: "2021-01-17 07:00:00",
			},
			{
				uuid: "ae4df4f1-a428-400d-bb16-edd4237e0c47",
				content: "No, I'm not...",
				from: "elliot",
				to: "angela",
				createdAt: "2021-01-17 08:00:00",
				updatedAt: "2021-01-17 08:00:00",
			},
			{
				uuid: "0a7c92ac-f69c-4799-8aad-9663a4afb47d",
				content: "How can you?",
				from: "darlene",
				to: "elliot",
				createdAt: "2021-01-17 09:00:00",
				updatedAt: "2021-01-17 09:00:00",
			},
			{
				uuid: "240dd560-5825-4d5d-b089-12a67e8ec84c",
				content: "What???",
				from: "elliot",
				to: "darlene",
				createdAt: "2021-01-17 10:00:00",
				updatedAt: "2021-01-17 10:00:00",
			},
			{
				uuid: "fd4cee68-5caf-4b1b-80a9-5b9add7fd863",
				content: "Bonsoir Elliot...",
				from: "tyrell",
				to: "elliot",
				createdAt: "2021-01-17 11:00:00",
				updatedAt: "2021-01-17 11:00:00",
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("messages", null, {});
	},
};
