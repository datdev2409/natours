const nodemailer = require('nodemailer');

const sendEmail = async options => {
	var transporter = nodemailer.createTransport({
		host: 'smtp.mailtrap.io',
		port: 2525,
		auth: {
			user: '6638e0f2899168',
			pass: 'aec0e269ff1e43'
		}
	});
	// Activate less secure app option
	await transporter.sendMail({
		from: '"Cong Dat" <datdev2409@gmail.com>', // sender address
		to: options.to, // list of receivers
		subject: options.subject, // Subject line
		text: options.text, // plain text body
		html: options.html // html body
	});
};

module.exports = sendEmail;
