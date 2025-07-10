import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { User} from "../models/users.model.js";
import jwt from "jsonwebtoken";

const VerifyJWT = asynchandler(async(req,_,next) =>{
        // Check if the request has an authorization header
    try {
        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("bearer ","")
        if(!token){
            throw new ApiError(401,"Access Tokem is required for Authorization")
        }

        const decodetoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodetoken._id).select("-password -refreshToken") 
        // Exclude password and refreshToken from the response
        
          if(!user){
             throw new ApiError(401, "User not found")
         }
 
         req.user = user; // Attach the user object to the request for further use
         next(); // Call the next middleware or route handler
    } catch (error) {
        throw new ApiError(401,error.message || "Unauthorization access , Invalid access Token")
    }
})