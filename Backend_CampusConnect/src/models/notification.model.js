import mongoose from "mongoose";
// Like, comment, or admin announcement notifications ke liye.
const notificationSchema = new mongoose.Schema({
        message:{
            type:String,
        },
        
        link:String, // e.g., "/post/:id"
        
        toUser:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        }
    ],
        isRead:{
            type:Boolean,
            default:false
        }
         
        
},{ timestamps: true })

export const Notification = mongoose.model('Notification',notificationSchema)