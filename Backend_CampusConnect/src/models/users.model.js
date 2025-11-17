import mongoose from 'mongoose';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// Ye schema har registered student/user ko represent karega.

const userSchema = new mongoose.Schema({
     username:{
        type:String,
        required:[true, 'Username is required'],
        trim:true,
        unique:true,
        lowercase:true
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
     email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true, // Normalize email to lowercase
    },
    password:{
        type:String,
        required:[true ,`Password is required`],
    },
     bio:{
        type:String,
        required:true,
    },
     avatar:{
        type:String,
        default: 'https://ui-avatars.com/api/?name=User&background=2563eb&color=fff'
    },
     coverimage: {
            type : String, //cloudinary url
        },
    department:{
        type:String,
         required: true,
    },
    role:{
        type:String,
        enum: ['Student','Faculty','Admin'],
        default:'Student'
    },
     refreshToken: {
            type : String,
            default: null,
     }
    

},{timestamps:true})


// middleware function to hash the password before saving
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next() // If the password is not modified, skip hashing
    // If the password is modified, hash it
    this.password = await bcrypt.hash(this.password,10) // Hash the password with a salt rounds of 10
    next() // Call the next middleware function
})

// custom methods  to check password is correct
userSchema.methods.isPasswordCorrect = async function(Password){
    return await bcrypt.compare(Password,this.password) // Compare the provided password with the hashed password
    // If the passwords match, return true
}
// use jwt to generate access token

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {   //payload : above 
            _id : this._id, // User ID
            email:this.email, // User email
            username: this.username, // User username
            fullname: this.fullname, // User full name
            
        },
        process.env.ACCESS_TOKEN_SECRET, // Secret key for signing the token
        {
            expiresIn:  process.env.ACCESS_TOKEN_EXPIRY // Token expiration time (1 day)
        }
    )
}
// use jwt to generate refresh token
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {   
            _id : this._id, // User ID
        },
        process.env.REFRESH_TOKEN_SECRET, // Secret key for signing the token
        {
            expiresIn:  process.env.REFRESH_TOKEN_EXPIRY // Token expiration time (7 days)
        }   
    )
}
 export const User = mongoose.model("User",userSchema)