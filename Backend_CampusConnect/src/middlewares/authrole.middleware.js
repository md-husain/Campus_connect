import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";

const authorizeRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        throw new ApiError(403, "You don't have permission");
    }
    next();
};
