import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse} from "../utils/ApiResponse.js";
import  { asynchandler } from "../utils/asyncHandler.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import {VerifyJWT} from "../middlewares/auth.middleware.js";
import jwt from "jsonwebtoken";
import fs from 'fs';
import path from 'path';

// a sep method to genrate access and refresh token(widely used in auth)
const genrateaccessandrefreshtoken = async (userid) =>{
    try {
        const user = await User.findById(userid)
          if (!user) {
            throw new ApiError(404, "User not found while generating tokens");
        }
        const accesstoken = user.generateAccessToken() // Generate access token
        const refreshtoken = user.generateRefreshToken() // Generate refresh token

        // save refresh token to user document(database)
        user.refreshtoken = refreshtoken
        user.save({validateBeforeSave: false}) // Save the user document without validating the password again  


        // return both tokens
          return {
      accessToken: accesstoken,
      refreshToken: refreshtoken
    };

        
    } catch (e) {
        throw new ApiError(500, "Internal Server Error while generating tokens")
    }
}

// @desc    Register a new user
const registerUser = asynchandler(async (req, res) => {
  console.log("📥 Register API hit");
  console.log("📥 Request body:", req.body);

  const { email, username, fullname, password, bio, department, role } = req.body;

  // 1. Validate common fields with detailed error messages
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  if (!username) {
    throw new ApiError(400, "Username is required");
  }
  if (!fullname) {
    throw new ApiError(400, "Full name is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }
  if (!department) {
    throw new ApiError(400, "Department is required");
  }
  if (!role) {
    throw new ApiError(400, "Role is required");
  }

  // 2. Validate role value
  const allowedRoles = ["Student", "Faculty", "Admin"];
  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, `Invalid role selected. Must be one of: ${allowedRoles.join(', ')}`);
  }

  // 3. Role-specific validation
  if (role === "Student" && (!bio || !bio.trim())) {
    throw new ApiError(400, "Bio is required for Students");
  }
  if (role === "Faculty" && (!bio || !bio.trim())) {
    throw new ApiError(400, "Faculty must add bio/qualification");
  }

  // 4. Normalize email and username before checking
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();

  // 5. Check if user already exists (case-insensitive)
  const existUserByEmail = await User.findOne({ 
    email: normalizedEmail 
  });
  if (existUserByEmail) {
    throw new ApiError(400, "User already exists with this email");
  }

  const existUserByUsername = await User.findOne({ 
    username: normalizedUsername 
  });
  if (existUserByUsername) {
    throw new ApiError(400, "Username already taken");
  }

  // 6. Create user with normalized values
  const newUser = await User.create({
    username: normalizedUsername,
    fullname: fullname.trim(),
    email: normalizedEmail,
    password,
    bio: bio?.trim() || '',
    department: department.trim(),
    role
  });

  // 7. Generate tokens
  const { accessToken, refreshToken } = await genrateaccessandrefreshtoken(newUser._id);

  // 8. Set Cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  // 9. Send response
  return res
    .status(201)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        {
          _id: newUser._id,
          username: newUser.username,
          fullname: newUser.fullname,
          email: newUser.email,
          bio: newUser.bio,
          avatar: newUser.avatar,
          coverimage: newUser.coverimage,
          department: newUser.department,
          role: newUser.role,
          accessToken,
          refreshToken
        },
        "User registered successfully"
      )
    );
});



// Function for Login User 
const LoginUser = asynchandler(async (req, res) => {
  console.log("📥 Login API hit");
  console.log("📥 Login request body:", req.body);
  
  const { email, password } = req.body;

  // 1. Check input
  if (!email || !password) {
    console.log("❌ Missing email or password");
    throw new ApiError(400, "Please provide both email and password");
  }

  // 2. Normalize email (same as registration)
  const normalizedEmail = email.trim().toLowerCase();
  console.log("🔍 Looking for user with email:", normalizedEmail);

  // 3. Find user by email (case-insensitive)
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    console.log("❌ User not found for email:", normalizedEmail);
    throw new ApiError(401, "Invalid email or password");
  }

  console.log("✅ User found:", user.username);

  // 4. Check password match
  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    console.log("❌ Password incorrect for user:", user.username);
    throw new ApiError(401, "Invalid email or password");
  }

  console.log("✅ Password correct for user:", user.username);

  // 5. Generate Tokens
  const { accessToken, refreshToken } = await genrateaccessandrefreshtoken(user._id);

  // 6. Save refreshToken to DB
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  console.log("✅ Tokens generated and saved for user:", user.username);

  // 7. Set cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  // 8. Send response
  console.log("📤 Sending login response for user:", user.username);
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          _id: user._id,
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
          coverimage: user.coverimage,
          department: user.department,
          role: user.role,
          accessToken,
          refreshToken,
        },
        `${user.role} logged in successfully`
      )
    );
});

// Logout users 

const logoutUser = asynchandler(async (req, res) => {
  // 1. Remove refreshToken from database for the user
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  // 2. Cookie options for clearing
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // or true if you're deploying with HTTPS
    sameSite: "None" // Use 'Strict' if both frontend/backend are same-origin
  };

  // 3. Clear both cookies
  return res.status(200)
    .clearCookie("refreshtoken", cookieOptions)
    .clearCookie("accesstoken", cookieOptions)
    .status(200)
    .json(new  ApiResponse(200, {}, "User logged out successfully"));
});

// @desc    Change Password of logged-in user
const changepassword = asynchandler(async (req, res) => {
  const { oldpassword, newpassword } = req.body;

  // 1. Input validation
  if (!oldpassword || !newpassword) {
    throw new ApiError(400, "Old and new passwords are required");
  }

  // 2. Get user from database
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 3. Check old password match
  const isPasswordCorrect = await user.isPasswordCorrect(oldpassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old password is incorrect");
  }

  // 4. Set new password
  user.password = newpassword;

  // 5. Save user (password will auto-hash because of pre-save hook)
  await user.save({ validateBeforeSave: false });

  // 6. Send response
  return res.status(200).json(
    new  ApiResponse(200, {}, "Password changed successfully")
  );
});

const getUserProfile = asynchandler(async (req, res) => {
  const userId = req.user._id; // middleware ne yeh add kiya

  const user = await User.findById(userId).select(
    "-password -refreshToken" // important: sensitive fields hide karo
  );

  if (!user) {
    throw new ApiError(404, "User profile nahi mila");
  }

  return res.status(200).json(
    new  ApiResponse(200, user, "User profile fetched successfully")
  );
});

//Logged-in user ke profile details update karega (bio, fullname, department, etc.)
//Avatar aur cover image ko Cloudinary pe re-upload bhi karega (agar naya diya ho)

const updateUserProfile = asynchandler(async (req, res) => {
  const userId = req.user._id;

  // Body se updated values le lo
  const { fullname, bio, department } = req.body;

  // Check karo kya user exist karta hai
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Avatar and cover image files check karo
  const localAvatarPath = req.files?.avatar?.[0]?.path;
  const localCoverPath = req.files?.coverimage?.[0]?.path;

  // Handle avatar upload
  if (localAvatarPath) {
    if (!fs.existsSync(localAvatarPath)) {
      throw new ApiError(400, "Avatar file not found");
    }

    try {
      const avatarUpload = await uploadonCloudinary(localAvatarPath);
      if (avatarUpload && avatarUpload.secure_url) {
        user.avatar = avatarUpload.secure_url;
      } else {
        throw new Error("Cloudinary upload failed");
      }
    } catch (cloudinaryError) {
      console.log("Cloudinary not configured, using local avatar storage");
      
      // Fallback to local storage
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const fileName = `avatar_${Date.now()}_${path.basename(localAvatarPath)}`;
      const newFilePath = path.join(uploadsDir, fileName);
      
      fs.copyFileSync(localAvatarPath, newFilePath);
      if (fs.existsSync(localAvatarPath)) {
        fs.unlinkSync(localAvatarPath);
      }
      
      user.avatar = `/uploads/${fileName}`;
    }
  }

  // Handle cover image upload
  if (localCoverPath) {
    if (!fs.existsSync(localCoverPath)) {
      throw new ApiError(400, "Cover image file not found");
    }

    try {
      const coverUpload = await uploadonCloudinary(localCoverPath);
      if (coverUpload && coverUpload.secure_url) {
        user.coverimage = coverUpload.secure_url;
      } else {
        throw new Error("Cloudinary upload failed");
      }
    } catch (cloudinaryError) {
      console.log("Cloudinary not configured, using local cover image storage");
      
      // Fallback to local storage
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const fileName = `cover_${Date.now()}_${path.basename(localCoverPath)}`;
      const newFilePath = path.join(uploadsDir, fileName);
      
      fs.copyFileSync(localCoverPath, newFilePath);
      if (fs.existsSync(localCoverPath)) {
        fs.unlinkSync(localCoverPath);
      }
      
      user.coverimage = `/uploads/${fileName}`;
    }
  }

  // Update remaining fields
  if (fullname) user.fullname = fullname;
  if (bio !== undefined) user.bio = bio; // Allow empty bio
  if (department) user.department = department;

  // Save updated user
  await user.save({ validateBeforeSave: false });

  // Return updated user without sensitive fields
  const updatedUser = await User.findById(userId).select("-password -refreshToken");

  return res.status(200).json(
    new ApiResponse(200, updatedUser, "Profile updated successfully")
  );
});

const deleteAccount = asynchandler(async (req, res) => {
  const userId = req.user._id;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Delete the user
  await User.findByIdAndDelete(userId);

  // (Optional) TODO: Delete user-related data like posts, comments, etc.

  // Clear cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refereshToken", cookieOptions)
    .json(
      new  ApiResponse(200, {}, "Your account has been deleted successfully.")
    );
});
const refreshAccessToken = asynchandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refereshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token not found");
  }

  // 1. Verify the token
  const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

  if (!decoded?._id) {
    throw new ApiError(401, "Invalid refresh token");
  }

  // 2. Find user
  const user = await User.findById(decoded._id);

  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  // 3. Generate new tokens
  const { accessToken, refreshToken } = await genrateaccessandrefreshtoken(user._id);

  // 4. Set new tokens in cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refereshToken", refreshToken, cookieOptions)
    .json(
      new  ApiResponse(200, {
        accessToken,
        refreshToken
      }, "Token refreshed successfully")
    );
});

const getAllUsers =  asynchandler(async (req, res) => {
    // Only admin can access this route
    if(req.user.role !== "Admin"){
        throw new ApiError(403, "Access denied. Only admins can view all users.")
    }

    //Fetch all users (you can add pagination or search)
    const users =  await User.find({})
     .select("-password,-refreshToken")
     .sort({createdAt : -1})
  
     // return response
     return res.status(200).json(
       new  ApiResponse( 200,{
            totalUsers: users.length,
            users,
        }
, "All users fetched successfully"))
})

const searchUsers = asynchandler(async (req, res) => {
  const { keyword = "", role, department } = req.query;

  // Step 1: Create a filter object
  const filter = {};

  // Optional text search on username, fullname or email
  if (keyword) {
    filter.$or = [
      { username: { $regex: keyword, $options: "i" } },
      { fullname: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } }
    ];
  }

  // Optional filter by role (Student, Faculty, Admin)
  if (role) {
    filter.role = role;
  }

  // Optional filter by department
  if (department) {
    filter.department = department;
  }

  // Step 2: Query the database
  const users = await User.find(filter)
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });

  // Step 3: Return result
  return res.status(200).json(
    new  ApiResponse(
      200,
      {
        totalResults: users.length,
        users
      },
      "Filtered users fetched successfully"
    )
  );
});


export{
    registerUser,
    LoginUser,
    logoutUser,
    changepassword,
    getUserProfile,
    updateUserProfile,
    deleteAccount,
    refreshAccessToken,
    getAllUsers,
    searchUsers
}