import mongoose from "mongoose";
//Har post ya event pe students comment karenge.
const commentSchema = new mongoose.Schema({
        text:{
            type:String,
            required:true
        },
        post:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Post',
            required:true
        },
         owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
         
        
},{ timestamps: true })

export const Comment = mongoose.model('Comment',commentSchema)