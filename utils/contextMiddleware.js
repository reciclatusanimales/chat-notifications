const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.json");

module.exports = (context) => {
	if (context.req && context.req.headers.authorization) {
		const token = context.req.headers.authorization.split("Bearer ")[1];

		jwt.verify(token, JWT_SECRET, (error, decodedToken) => {
			context.user = decodedToken;
		});
	}
	return context;
};
