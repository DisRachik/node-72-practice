const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	host: "smtp.ukr.net",
	port: 465,
	secure: true,
	auth: {
		user: "sandy16@ukr.net",
		pass: "6P4NxggWKBUgsqhx",
	},
});

async function sendEmail({ userName, userEmail, userText }) {
	const output = `<h3 style="color: blue">Ви отримали листа від ${userName}</h3>
		<p>Email для контактів ${userEmail}</p>
		<p>Текс повідомлення: ${userText}</p>
		<p style="color: green">Дякуємо за звернення. Чекайте на зв'зок</p>`;

	const info = await transporter.sendMail({
		from: "sandy16@ukr.net", // sender address
		to: "sushkoandy1@gmail.com", // list of receivers
		subject: "Лист до директора компанії. СКАРГА", // Subject line
		text: userText, // plain text body
		html: output, // html body
	});

	console.log("Message sent: %s", info.messageId);
}

module.exports = sendEmail;
