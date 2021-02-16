const { PubSub } = require("apollo-server-express");
const { Message } = require("../models");

const pubsub = new PubSub();

exports.create = async (request, response) => {
	try {
		const message = await Message.create({
			from: "tuto",
			to: "javieramena",
			content: "TRIGGER",
		});

		pubsub.publish("NEW_NOTIFICATION", { newNotification: message });

		return response.status(200).json(message);
	} catch (error) {
		console.log(error);
		return response.status(500).json({ error: error });
	}
};
