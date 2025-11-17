import mongoose from "mongoose";
import express from "express";
import { DB_NAME } from "../../constant.js";

const connectDB = async() =>{
    try { 
      // If MONGO_URI already contains database name, use it directly, otherwise append DB_NAME
       const mongoUri = process.env.MONGO_URI 
        ? (process.env.MONGO_URI.includes('?') 
            ? process.env.MONGO_URI 
            : `${process.env.MONGO_URI}/${DB_NAME}`)
        : `mongodb://localhost:27017/${DB_NAME}`;
        
      const connectionInstance = await mongoose.connect(mongoUri);
      console.log(`\n MONGODB connected successfully: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("Mongodb connection error:", error.message);
        process.exit(1);
    }
}

export default connectDB