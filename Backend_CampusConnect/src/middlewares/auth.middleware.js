import { asynchandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User} from "../models/users.model.js";
import jwt from "jsonwebtoken";

const VerifyJWT = asynchandler(async(req,_,next) =>{
        // Check if the request has an authorization header
    try {
        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"Access Token is required for Authorization")
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
        throw new ApiError(401,error.message || "Unauthorized access, Invalid access Token")
    }
})

export { VerifyJWT };