const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
import userRoute from "./routes/user";

dotenv.config();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);

export const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		console.log(err);
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
};

app.listen(process.env.SERVER_PORT || 5000, () => {
	console.log("Backend server is running");
});
