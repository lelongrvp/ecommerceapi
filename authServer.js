const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json());
app.use(cors());

app.listen(process.env.AUTH_SERVER_PORT || 5001, () => {
    console.log("Authentication server is running");
});