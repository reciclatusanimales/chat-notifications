"use strict";
const { Model } = require("sequelize");
const { makeId } = require("../utils");

module.exports = (sequelize, DataTypes) => {
	class Notification extends Model {
		static associate({ User, Sub, Post, Comment }) {
			this.belongsTo(User, {
				foreignKey: "username",
				as: "user",
			});
			this.belongsTo(User, {
				foreignKey: "sendername",
				as: "sender",
			});
			this.belongsTo(Sub, {
				foreignKey: "subName",
				as: "sub",
			});
			this.belongsTo(Post, {
				foreignKey: "postId",
				as: "post",
			});
			this.belongsTo(Comment, {
				foreignKey: "commentId",
				as: "comment",
			});
		}
	}
	Notification.init(
		{
			identifier: {
				type: DataTypes.STRING,
				allowNull: true,
				unique: true,
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			value: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			read: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: false,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			sendername: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			subName: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			postId: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			commentId: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			sequelize,
			modelName: "Notification",
			tableName: "notifications",
		}
	);

	Notification.beforeCreate(async (notification, options) => {
		notification.identifier = makeId(8);
	});

	return Notification;
};
