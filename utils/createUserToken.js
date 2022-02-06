const jwt = require('jsonwebtoken');

function createUserToken(id) {
	const privateKey = process.env.JWT_SECRET;
	const expiresIn = process.env.JWT_EXPIRES_IN;
	const token = jwt.sign({ id }, privateKey, { expiresIn });
	return token;
}

module.exports = createUserToken;
