"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = exports.updateUserInfo = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const config_1 = __importDefault(require("../../config"));
const cloudinary_config_1 = require("../../config/cloudinary.config");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const password = user.password;
        const result = yield user_service_1.UserServices.createUserIntoDB(password, user);
        res.status(200).json({
            success: true,
            statusCode: http_status_1.default.OK,
            message: "User registered successfully",
            data: result,
        });
    }
    catch (err) {
        console.log(err);
    }
});
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.loginUser(req.body);
    const { token } = result;
    const user = result.user;
    const { refreshToken } = result;
    res.cookie("refreshToken", refreshToken, {
        secure: config_1.default.NODE_ENV === "production",
        httpOnly: true,
    });
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "User logged in successfully!",
        accessToken: token,
        refreshToken,
        data: user,
    });
}));
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield user_service_1.UserServices.refreshToken(refreshToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Access token retrieved successfully!",
        data: result,
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_service_1.UserServices.getAllUsers();
    res.status(http_status_1.default.OK).json({
        success: true,
        data: users,
    });
}));
const updateUserRole = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { role } = req.body;
    const updatedUser = yield user_service_1.UserServices.updateUserRole(userId, role);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "User role updated successfully",
        data: updatedUser,
    });
}));
exports.updateUserInfo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const updatedData = req.body;
    // If there is a file in the request, handle Cloudinary upload
    if (req.files) {
        const postImage = req.files["postImages"][0];
        // Upload to Cloudinary
        const result = yield cloudinary_config_1.cloudinaryUpload.uploader.upload(postImage.path, {
            folder: "profile_pictures", // Save images in this folder in Cloudinary
        });
        // Add the Cloudinary image URL to the updatedData object
        updatedData.img = result.secure_url;
    }
    // Call the service to update the user data
    const updatedUser = yield user_service_1.UserServices.updateUserInfo(userId, updatedData);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
    });
}));
// Follow/Unfollow Controller
const toggleFollowController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentUserId, targetUserId } = req.body; // Assuming user ID is available in req.body
        console.log(currentUserId, targetUserId);
        // Call the toggleFollowUser function to handle follow/unfollow logic
        const { currentUser, targetUser, isFollowing } = yield user_service_1.UserServices.toggleFollowUser(currentUserId, targetUserId);
        // Return updated users and follow status
        res.status(200).json({
            message: `You have successfully ${isFollowing ? "followed" : "unfollowed"} the user.`,
            currentUser, // Includes populated followings
            targetUser, // Includes populated followers
        });
    }
    catch (error) {
        next(error); // Pass error to the next middleware (error handler)
    }
});
const verifyUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield user_service_1.UserServices.verifyUser(userId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "User verified successfully",
        data: result,
    });
}));
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield user_service_1.UserServices.deleteUserFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Post deleted successfully",
        data: null,
    });
}));
exports.UserControllers = {
    createUser,
    loginUser,
    refreshToken,
    getAllUsers,
    updateUserRole,
    updateUserInfo: exports.updateUserInfo,
    verifyUser,
    toggleFollowController,
    deleteUser,
};
