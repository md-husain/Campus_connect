import mongoose from "mongoose";
import dotenv from "dotenv"; // Load environment variables from .env file
import app from "./app.js";
import { DB_NAME } from "./constant.js";
import express from "express";
import connectDB from "./src/Database/database.index.js";

dotenv.config({
  path:"./.env"
}); // load env ke variables

const PORT = process.env.PORT || 5000;
connectDB()
.then(() =>[
  app.listen(PORT,()=>{
       console.log(`Server is running on port ${process.env.PORT }`);
   
  })
])

// mongoose.connect(process.env.MONGO_URI)
//   .then(() =>{
//     app.listen(PORT, ()=>{
//               console.log(` Backend Server is running at http://localhost:${PORT}`);

//     })
//   }).catch((err) => {
//     console.error(" MongoDB connection failed:", err.message);
//     process.exit(1);
//   })



//  //approch 1
// dotenv.config({ path: "./env" });

// //const app = express();

// (async () => {
//     try {
//         // Use only process.env.MONGO_URI if it already contains the db name
//         await mongoose.connect(process.env.MONGO_URI);

//         app.on("error", (e) => {
//             console.error("Error in app:", e);
//             throw e;
//         });

//         app.listen(process.env.PORT, () => {
//             console.log(`Server is running on port ${process.env.PORT}`);
//         });
//     } catch (error) {
//         console.error("Error connecting to the database:", error);
//         process.exit(1); // Exit the process if DB connection fails
//     }
// })();