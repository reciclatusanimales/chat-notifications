"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Post extends Model {
		static associate({ User, Sub }) {
			this.belongsTo(User, {
				foreignKey: "username",
			});
			this.belongsTo(Sub, {
				foreignKey: "subName",
			});
		}
	}
	Post.init(
		{
			identifier: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			slug: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			body: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			subName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Post",
			tableName: "posts",
		}
	);
	return Post;
};
