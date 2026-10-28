import mongoose from "mongoose";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"])

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("Database connected successfully");
    } catch (error) {
        console.log(`Database error: ${error}`);
    }
};

export default connectDb;