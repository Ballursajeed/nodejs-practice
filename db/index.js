import mongoose from "mongoose"

const connectDB= async()=>{
 try {
  const connectionInstance = await mongoose.connect("mongodb+srv://ballursajeed:Welcome7867@cluster0.nllcgum.mongodb.net/sample-prac");
  console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
 } catch (error) {
  console.log("mongoDB connection FAILED:",error);
  process.exit(1)
 }
}
export default connectDB