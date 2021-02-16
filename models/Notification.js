"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Notification extends Model {
		static associate({ User, Sub, Post, Comment }) {
			this.belongsTo(User, {
				foreignKey: "username",
			});
			this.belongsTo(User, {
				foreignKey: "sendername",
			});
			this.belongsTo(Sub, {
				foreignKey: "subName",
			});
			this.belongsTo(Post, {
				foreignKey: "postId",
			});
			this.belongsTo(Comment, {
				foreignKey: "commentId",
			});
		}
	}
	Notification.init(
		{
			identifier: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			read: {
				type: DataTypes.STRING,
				defaultValue: false,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			sendername: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			subName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			postId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			commentId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Notification",
			tableName: "notifications",
		}
	);
	return Notification;
};
