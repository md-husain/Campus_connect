import { Router } from "express";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authrole.middleware.js"; 
import {  
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
 } from "../controllers/user.controller.js";
 import { loginRateLimiter, registerRateLimiter } from "../middlewares/ratelimit.middleware.js";
import {upload} from "../middlewares/mullter_middlewares.js";

const router = Router();
//user router
router.get("/ping", (req, res) => {
  res.status(200).json({ message: "✅ User route working fine!" });
});

// router.post(
//   "/register_user",
//   registerRateLimiter,
//   upload.fields([
//     { name: "avatar", maxCount: 1 },
//     { name: "coverimage", maxCount: 1 }
//   ]),
//   registerUser
// )
router.post(
  "/register_user",
  registerRateLimiter,
  registerUser
);

// User Login
router.post("/login_user", loginRateLimiter, LoginUser);
// User Logout
router.route("/logout_user").get(VerifyJWT, logoutUser)
// Change Password
router.route("/change_password").put(VerifyJWT, changepassword)
// Get User Profile
router.route("/get_user_profile").get(VerifyJWT, getUserProfile)
// Update User Profile
router.route("/update_user_profile").put(
    VerifyJWT,
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverimage", maxCount: 1 }
    ]),
    updateUserProfile
)
// Delete User Account
router.route("/delete_account").delete(VerifyJWT, deleteAccount)
// Refresh Access Token
router.route("/refresh_access_token").get( refreshAccessToken)
// Get All Users (Admin Only)
router.route("/get_all_users").get(
    VerifyJWT,
    authorizeRoles("admin"),
    getAllUsers
)

router.get("/search_users", VerifyJWT, authorizeRoles("admin"), searchUsers);

export default router;