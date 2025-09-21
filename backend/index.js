import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: "http://localhost:5173", credentials: true}));

app.use(express.json()); //always use to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
	connectDB();
	console.log("Server is running on port: ", PORT);
});

//p8qC2oOFU0tVhXoP
//mongodb+srv://ridma:p8qC2oOFU0tVhXoP@cluster0.62suylq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0