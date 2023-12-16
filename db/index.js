import dotenv from 'dotenv';
import mongoose from "mongoose"

const connectDB= async()=>{
await mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected!!!"))
  .catch((error) => console.error("MongoDB connection error:", error));
}
export default connectDB