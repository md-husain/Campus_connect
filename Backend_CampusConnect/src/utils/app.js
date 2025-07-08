import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
  app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  }))


// security pratices
  //set limit
  app.use(express.json({
    limit: '50mb' 
  }));

  //from url +,% btw in name
  app.use(express.urlencoded({extended:true , limit: '50kb'})) // Increase the limit to 50mb

  // ex ki config static img/file of public\
  app.use(express.static('public'))

// cookie parser(server se client ke browser ki cookies ko access/set karne ke liye)
  app.use(cookieParser())

  // import routes  import videorouter from './routes/video.routes.js';
// routes declaration
//app.use("/api/v1/user",userrouter)

export { app }