"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Thread extends Model {
		static associate({ User }) {
			this.belongsToMany(User, {
				through: "ThreadUser",
				as: "users",
				foreignKey: "threadId",
			});
		}
	}
	Thread.init(
		{},
		{
			sequelize,
			modelName: "Thread",
			tableName: "threads",
		}
	);
	return Thread;
};
