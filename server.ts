const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
import userRoute from "./routes/user";

dotenv.config();

app.use(express.json());
app.use(cors());

/**
 * Authentication middleware verify jwt
 */
app.use((req: any, res: any, next: any) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.status(401).send({message: "Unauthorized"});

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
		console.log(err);
		if (err) return res.status(403).send({message: "Invalid token"});
		req.user = user;
		next();
	});
});

app.use("/user", userRoute);

export const authenticateAdmin = (req: any, res: any, next: any) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	const [isAdmin] = jwt.decode(token).payload;
	return isAdmin ? next() : res.status(401).send({message: "Unauthorized user"})
}

app.listen(process.env.SERVER_PORT || 5000, () => {
	console.log("Backend server is running");
});
