import { User } from "../models/users.model.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/ApiResponse.js";
import asyncHandler, { asynchandler } from "../utils/asyncHandler.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import VerifyJWT from "../middlewares/auth.middleware.js";

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
        return { accesstoken,refreshtoken}
        
    } catch (e) {
        throw new ApiError(500, "Internal Server Error while generating tokens")
    }
}

// @desc    Register a new user
// @desc    Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { email, username, fullname, password, bio, department, role } = req.body;

  // 1. Validate common fields
  if (!email || !username || !fullname || !password || !department || !role) {
    throw new ApiError(400, "All fields including role are required");
  }

  // 2. Validate role value
  const allowedRoles = ["Student", "Faculty", "Admin"];
  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, "Invalid role selected");
  }

  // 3. Role-specific validation (example: bio is required for Student only)
  if (role === "Student" && !bio) {
    throw new ApiError(400, "Bio is required for Students");
  }
  if (role === "Faculty" && !bio) {
    throw new ApiError(400, "Faculty must add bio/qualification");
  }

  // 4. Check if user already exists
  const existUser = await User.findOne({ email });
  if (existUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  // 5. Handle image uploads
  const localAvatarPath = req?.files?.avatar?.[0]?.path;
  const localCoverPath = req?.files?.coverimage?.[0]?.path || null;

  if (!localAvatarPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  const avatarUpload = await uploadonCloudinary(localAvatarPath);
  const coverUpload = localCoverPath ? await uploadonCloudinary(localCoverPath) : null;

  const avatar = avatarUpload?.secure_url;
  const coverimage = coverUpload?.secure_url || "";

  // 6. Create user
  const newUser = await User.create({
    username,
    fullname,
    email,
    password,
    bio,
    avatar,
    coverimage,
    department,
    role
  });

  // 7. Generate tokens
  const { accessToken, refreshToken } = await genrateaccessandrefreshtoken(newUser._id);

  // 8. Set Cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };

  // 9. Send response
  return res
    .status(201)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new Apiresponse(
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



// Fucntion for Login User 
const LoginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Check input
  if (!email || !password) {
    throw new ApiError(400, "Please provide both email and password");
  }

  // 2. Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "User not found with this email");
  }

  // 3. Check password match
  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 4. Generate Tokens
  const { accessToken, refreshToken } = await genrateaccessandrefreshtoken(user._id);

  // 5. Save refreshToken to DB (optional but secure)
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // 6. Set cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  // 7. Send response
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new Apiresponse(
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

const logoutUser = asyncHandler(async (req, res) => {
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
    .json(new Apiresponse(200, {}, "User logged out successfully"));
});

// @desc    Change Password of logged-in user
const changepassword = asynchandler(async (req, res) => {
  const { oldpassword, newpassword } = req.body;

  // 1. Input validation
  if (!oldpassword || !newpassword) {
    throw new apiError(400, "Old and new passwords are required");
  }

  // 2. Get user from database
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new apiError(404, "User not found");
  }

  // 3. Check old password match
  const isPasswordCorrect = await user.isPasswordCorrect(oldpassword);
  if (!isPasswordCorrect) {
    throw new apiError(400, "Old password is incorrect");
  }

  // 4. Set new password
  user.password = newpassword;

  // 5. Save user (password will auto-hash because of pre-save hook)
  await user.save({ validateBeforeSave: false });

  // 6. Send response
  return res.status(200).json(
    new Apiresponse(200, {}, "Password changed successfully")
  );
});

const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id; // middleware ne yeh add kiya

  const user = await User.findById(userId).select(
    "-password -refreshToken" // important: sensitive fields hide karo
  );

  if (!user) {
    throw new ApiError(404, "User profile nahi mila");
  }

  return res.status(200).json(
    new Apiresponse(200, user, "User profile fetched successfully")
  );
});

//Logged-in user ke profile details update karega (bio, fullname, department, etc.)
//Avatar aur cover image ko Cloudinary pe re-upload bhi karega (agar naya diya ho)

const updateUserProfile = asyncHandler(async (req, res) => {
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

  // Cloudinary upload agar nayi image aayi ho
  if (localAvatarPath) {
    const avatarUpload = await uploadonCloudinary(localAvatarPath);
    user.avatar = avatarUpload?.secure_url || user.avatar;
  }

  if (localCoverPath) {
    const coverUpload = await uploadonCloudinary(localCoverPath);
    user.coverimage = coverUpload?.secure_url || user.coverimage;
  }

  // Update remaining fields
  if (fullname) user.fullname = fullname;
  if (bio) user.bio = bio;
  if (department) user.department = department;

  // Save changes
  await user.save();

  return res.status(200).json(
    new Apiresponse(200, {
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      bio: user.bio,
      avatar: user.avatar,
      coverimage: user.coverimage,
      department: user.department,
      email: user.email,
      role: user.role
    }, "Profile updated successfully")
  );
});

const deleteAccount = asyncHandler(async (req, res) => {
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
      new Apiresponse(200, {}, "Your account has been deleted successfully.")
    );
});
const refreshAccessToken = asyncHandler(async (req, res) => {
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
      new Apiresponse(200, {
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
       new Apiresponse( 200,{
            totalUsers: users.length,
            users,
        }
, "All users fetched successfully"))
})

const searchUsers = asyncHandler(async (req, res) => {
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
    new Apiresponse(
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