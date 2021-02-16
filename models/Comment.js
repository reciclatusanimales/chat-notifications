"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Comment extends Model {
		static associate({ User, Post }) {
			this.belongsTo(User, {
				foreignKey: "username",
			});
			this.belongsTo(Post, {
				foreignKey: "postId",
			});
		}
	}
	Comment.init(
		{
			identifier: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			body: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			postId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Comment",
			tableName: "comments",
		}
	);
	return Comment;
};
