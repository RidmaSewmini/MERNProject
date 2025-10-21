import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		const mongoUri = process.env.MONGO_URI || "mongodb+srv://himansa:wJxWvZbUmQsdXcBu@cluster0.62suylq.mongodb.net/techspherelk_db?retryWrites=true&w=majority&appName=Cluster0";
		console.log("mongo_uri: ", mongoUri);
		const conn = await mongoose.connect(mongoUri);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.log("Error connection to MongoDB: ", error.message);
		console.log("Attempting to continue without database connection...");
		// Don't exit, let the server continue running for testing
	}
};