"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ThreadUser extends Model {
		static associate({ Thread, User }) {}
	}
	ThreadUser.init(
		{
			threadId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "ThreadUser",
			tableName: "threads_users",
		}
	);
	return ThreadUser;
};
