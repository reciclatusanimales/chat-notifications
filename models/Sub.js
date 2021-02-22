"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Sub extends Model {
		static associate({ User }) {
			this.belongsTo(User, {
				foreignKey: "username",
			});
		}
	}
	Sub.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			imageUrn: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			imageUrn: DataTypes.STRING,
			imageUrl: {
				type: DataTypes.VIRTUAL,
				get() {
					return this.imageUrn
						? `${process.env.APP_URL}/images/${this.imageUrn}`
						: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
				},
			},
		},
		{
			sequelize,
			modelName: "Sub",
			tableName: "subs",
		}
	);
	return Sub;
};
