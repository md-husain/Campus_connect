import mongoose from "mongoose";
// Agar chat feature chahiye toh har message ka record banega.
const messageSchema = new mongoose.Schema({
        text:{
            type:String,
            required:true
        },
        Sender:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
    ],
         receiver:[
         {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
    ],
         
        
},{ timestamps: true })

export const Message = mongoose.model('Message',messageSchema)