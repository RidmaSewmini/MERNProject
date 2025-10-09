import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import rentalRoutes from "./routes/RentalForm.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: true, // allow any origin in dev
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(express.json()); //always use to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use("/api/auth", authRoutes);
app.use("/api/rental", rentalRoutes);

app.listen(PORT, () => {
	connectDB();
	console.log("Server is running on port: ", PORT);
});

//p8qC2oOFU0tVhXoP
//mongodb+srv://ridma:p8qC2oOFU0tVhXoP@cluster0.62suylq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0