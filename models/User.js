"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate({ Notification, Thread }) {
			this.belongsToMany(Thread, {
				through: "ThreadUser",
				as: "threads",
				foreignKey: "username",
			});
			this.hasMany(Notification, {
				foreignKey: "username",
				as: "notifications",
			});
		}
	}
	User.init(
		{
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true,
				unique: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: {
						args: true,
						msg: "Must be a valid email address.",
					},
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			imageUrn: DataTypes.STRING,
			imageUrl: {
				type: DataTypes.VIRTUAL,
				get() {
					return this.imageUrn
						? `${process.env.APP_URL}/images/profiles/${this.imageUrn}`
						: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
				},
			},
		},
		{
			sequelize,
			modelName: "User",
			tableName: "users",
		}
	);
	return User;
};
