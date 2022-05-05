import { getUserByUsername, createUser, updateUser, getUserByEmail } from './services/user';
import { options } from './swaggerOptions';
const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

dotenv.config();
const swaggerSpec = swaggerJSDoc(options(process.env.AUTH_SERVER_PORT || '5001'));

app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.post('/auth/token', async (req, res) => {
	const [accessToken] = req.body;
	const [username] = jwt.decode(accessToken).payload;

	const dbUser = await getUserByUsername(username);

	jwt.verify(dbUser.refreshToken, process.env.REQUEST_TOKEN_SECRET, (err, _) => {
		if (err) return res.status(403).send({ message: "Unauthorized token" });
		const accessToken = generateAccessToken(dbUser);
		return res.status(201).send({ jwt: accessToken });
	})
})

app.get("/auth/signin", async (req, res) => {
	const [username, password] = req.body;

	const dbUser = await getUserByUsername(username);

	if (dbUser) {
		bcrypt.compare(password, dbUser).then(async (res) => {
			if (res) {
				const accessToken = generateAccessToken(dbUser);
				const refreshToken = generateRefreshToken(dbUser);

				await updateUser({ ...dbUser, refreshToken: refreshToken });

				return res.status(200).send({ jwt: accessToken });
			}
		})
	}

	return res.status(401).send({ message: "Login failed!" })
});

app.get("/auth/signup", async (req, res) => {
	const [user] = req.body;

	let dbUser = await getUserByUsername(user.username);

	if (dbUser) {
		return res.status(400).send({ message: "Duplicated username" });
	}

	dbUser = await getUserByEmail(user.email);

	if (dbUser) {
		return res.status(400).send({ message: "Duplicated email" });
	}

	bcrypt.hash(user.password, 8, async (err, hashedPassword) => {
		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);
		await createUser({ ...user, password: hashedPassword, refreshToken: refreshToken });

		return res.status(201).send({ jwt: accessToken });
	})
})

function generateAccessToken(user) {
	return jwt.sign({
		user: user.username,
		isAdmin: user.isAdmin
	}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" })
}

function generateRefreshToken(user) {
	return jwt.sign({
		username: user.username,
		isAdmin: user.isAdmin
	}, process.env.REQUEST_TOKEN_SECRET, { expiresIn: "7d" })
}

app.listen(process.env.AUTH_SERVER_PORT || 5001, () => {
	console.log("Authentication server is running");
});
