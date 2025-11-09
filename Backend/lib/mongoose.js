import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { MONGO_URI = "mongodb://127.0.0.1:27017/hogwarts_bookstore" } =
  process.env;

export async function connectMongo() {
  // Avoid multiple connects if hot reloading
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  mongoose.set("strictQuery", true);
  await mongoose.connect(MONGO_URI, {
    // options can be added here if needed
  });
  return mongoose.connection;
}

export default mongoose;
