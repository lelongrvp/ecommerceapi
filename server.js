const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
import userRoute from "./routes/user"

dotenv.config();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);

app.listen(process.env.SERVER_PORT || 5000, () => {
    console.log("Backend server is running")
});