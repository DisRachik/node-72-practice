const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { engine } = require("express-handlebars");
const sendEmail = require("./services/sendEmail");
console.log("Hello everyone!");
const configPath = path.join(__dirname, "..", "config", ".env");
require("dotenv").config({ path: configPath });
require("colors");
const errorHandler = require("./middlewares/errorHandler");

const conectDb = require("../config/conectDb");
const asyncHandler = require("express-async-handler");
const UsersModel = require("./models/Users");
const RolesModel = require("./models/Roles");
const authMDW = require("./middlewares/authMDW");
const { send } = require("process");

const app = express();

app.use(express.static("public"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "backend/views");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
	res.render("home");
});
app.get("/about", (req, res) => {
	res.render("about");
});
app.get("/contact", (req, res) => {
	res.render("contact");
});
app.post("/sended", async (req, res) => {
	// res.send(req.body);
	res.render("sended", {
		message: "Contact was send succesfully",
		name: req.body.userName,
		email: req.body.userEmail,
	});

	await sendEmail(req.body);
});

app.use("/api/v1", require("./routes/carsRoute"));

// реєстрація - створення і збереження нового користувача в БД
// аутентифікація - перевірка і порівняння даних, що дав користувач з тим, що записано в БД
// авторизація - перевірка прав доступу (наприклад до колекції даних)
// логаут - вихід із системи користувачем

app.get("/register", (req, res) => {
	res.render("register");
});

app.post(
	"/register",
	asyncHandler(async (req, res) => {
		// отримуємо і валідуємо дані від користувача
		// перевіряємо чи є в БД такий користувач в БД
		// якщо є - викидаємо помилку (наприклад що юзер вже існує)
		// якщо не знайшли - хешуємо пароль
		// збергаємо нового користувача в БД

		const { email, password } = req.body;

		if (!email || !password) {
			res.status(400);
			throw new Error(`Provide all fields`);
		}

		const candidate = await UsersModel.findOne({ email });

		if (candidate) {
			res.status(409);
			throw new Error(`Email is already used`);
		}

		const roles = await RolesModel.findOne({ value: "ADMIN" });

		const hashPassword = bcrypt.hashSync(password, 5);

		const user = await UsersModel.create({
			...req.body,
			password: hashPassword,
			roles: [roles.value],
		});

		// res.status(201).json({
		// 	code: 201,
		// 	user: {
		// 		name: user.name,
		// 		email: user.email,
		// 	},
		// });

		res.render("registrationSuccess");
	})
);

app.get("/login", (req, res) => {
	res.render("login");
});

app.post(
	"/login",
	asyncHandler(async (req, res) => {
		// отримуємо і валідуємо дані від користувача
		// перевіряємо чи є в БД такий користувач в БД
		// якщо є - розшифровуємо пароль (compare)
		// якщо не знайшли або не розшифрували викидаємо помилку ("Invalid login or password")
		// якщо все ок - видаємо токен
		// зберігаэмо токен в БД
		// повертаємо відповідь з токеном на клієнт

		const { email, password } = req.body;

		if (!email || !password) {
			res.status(400);
			throw new Error(`Provide all fields`);
		}

		const candidate = await UsersModel.findOne({ email });

		if (!candidate) {
			res.status(400);
			throw new Error(`Invalid login or password`);
		}

		const isValidPassword = bcrypt.compareSync(password, candidate?.password);

		if (!isValidPassword) {
			res.status(400);
			throw new Error(`Invalid login or password`);
		}

		const token = generateToken({
			friends: ["Pol", "Tom", "Bob"],
			id: candidate._id,
			roles: candidate.roles,
		});

		candidate.token = token;

		await candidate.save();

		// res.status(200).json({
		// 	code: 200,
		// 	user: {
		// 		token: candidate.token,
		// 		email: candidate.email,
		// 	},
		// });

		res.render("loginSuccess");
	})
);

app.get(
	"/logout",
	authMDW,
	asyncHandler(async (req, res) => {
		const { id } = req.user;

		const user = await UsersModel.findById(id);

		user.token = null;

		await user.save();

		res.status(200).json({
			code: 200,
			user: {
				message: "Logout successful",
			},
		});
	})
);

app.use(errorHandler);

conectDb();

function generateToken(data) {
	const payload = { ...data };

	return jwt.sign(payload, "pizza", { expiresIn: "3h" });
}

app.listen(process.env.PORT, () => {
	console.log(
		`Server running. Use port: ${process.env.PORT}`.green.italic.bold
	);
});
