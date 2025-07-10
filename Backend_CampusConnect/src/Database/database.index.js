import mongoose from "mongoose";
import express from "express";
import { DB_NAME } from "../../constant.js";

const connectDB = async() =>{
    try { 
      const connectionistance =   await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
      console.log(`\n MONGODB connected successfully${connectionistance.connection.host}`);

    } catch (error) {
        console.log("Mongodb connection error occur:",error)
        process.exit(1);
    }
}

export default connectDB