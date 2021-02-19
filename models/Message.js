"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Message extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ Reaction, Thread, User }) {
			this.hasMany(Reaction, {
				foreignKey: "messageId",
				as: "reactions",
			});
			this.belongsTo(Thread, {
				foreignKey: "threadId",
				as: "thread",
				targetKey: "id",
			});
			this.belongsTo(User, {
				foreignKey: "from",
				targetKey: "username",
				as: "user",
			});
		}
	}
	Message.init(
		{
			content: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
			},
			from: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			threadId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Message",
			tableName: "messages",
		}
	);
	return Message;
};
