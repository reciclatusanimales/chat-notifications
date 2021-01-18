"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Reaction extends Model {
		static associate({ User, Message }) {
			this.belongsTo(Message, {
				foreignKey: "messageId",
			});
			this.belongsTo(User, {
				foreignKey: "userId",
			});
		}
	}
	Reaction.init(
		{
			content: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			messageId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Reaction",
			tableName: "reactions",
		}
	);
	return Reaction;
};
