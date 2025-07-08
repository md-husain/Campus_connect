import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config(); // load env ke variables

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() =>{
    app.listen(PORT, ()=>{
              console.log(` Backend Server is running at http://localhost:${PORT}`);

    })
  }).catch((err) => {
    console.error(" MongoDB connection failed:", err.message);
    process.exit(1);
  })

