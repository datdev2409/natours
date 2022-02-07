const jwt = require('jsonwebtoken');

function signJWT(data = {}) {
	const privateKey = process.env.JWT_SECRET;
	const expiresIn = process.env.JWT_EXPIRES_IN;
	const token = jwt.sign(data, privateKey, { expiresIn });
	return token;
}

function sendUserToken(user, res, statusCode = 200) {
	if (!user) return;
	const token = signJWT({ id: user.id });

	const cookieOption = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true
	};
	if (process.env.NODE_ENV === 'production') cookieOption.secure = true;
	res.cookie('jwt', token, cookieOption);

	res.status(statusCode).json({
		status: 'success',
		data: {
			jwt: token
		}
	});
}

module.exports = sendUserToken;
