import mongoose from "mongoose";
// Students posts ya events share karenge. Isme text, images/videos ya location ho sakti hai.
const postSchema = new mongoose.Schema({
        content:{
            type:String,
            required:true
        },
         media:{
            type:String, //image/video URL
        },
        owner:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
    ],
         tags:[String], // #fun #exam #notice
          likes:[
          {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        }
    ],
         comments:[
         {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment',
        }
    ],
         
        
},{ timestamps: true })

export const Post = mongoose.model('Post',postSchema)