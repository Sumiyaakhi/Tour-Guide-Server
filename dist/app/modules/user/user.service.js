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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = exports.updateUserInfo = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("./user.model");
const AppError_1 = __importDefault(require("../../error/AppError"));
const config_1 = __importDefault(require("../../config"));
const user_utils_1 = require("./user.utils");
const payment_utils_1 = require("../payment/payment.utils");
// Create a new user
const createUserIntoDB = (password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user already exists
    const existingUser = yield user_model_1.User.findOne({ email: payload.email });
    if (existingUser) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "User already exists");
    }
    // Create new user in the database
    const newUser = yield user_model_1.User.create(payload);
    // Create JWT payload
    const jwtPayload = {
        sub: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        img: newUser.img,
        role: newUser.role,
        address: newUser.address,
        followers: newUser.followers,
        followings: newUser.followings,
        bio: newUser.bio,
    };
    // Create access token
    const accessToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in // Configure access token expiration time
    );
    // Create refresh token
    const refreshToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in // Configure refresh token expiration time
    );
    // Return user details and tokens (exclude password if necessary)
    const _a = newUser.toObject(), { password: _ } = _a, userWithoutPassword = __rest(_a, ["password"]);
    return {
        user: userWithoutPassword, // Exclude password from response
        accessToken,
        refreshToken,
    };
});
// Log in user
// const loginUser = async (
//   payload: TLoginUser
// ): Promise<{ token: string; refreshToken: string; user: Partial<TUser> }> => {
//   const user = await User.findOne({ email: payload.email }).select("+password");
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "User not found");
//   }
//   const jwtPayload = {
//     sub: user._id,
//     name: user.name,
//     email: user.email,
//     phone: user.phone,
//     img: user.img,
//     role: user.role,
//     bio: user.bio,
//     address: user.address,
//     verified: user.verified,
//     followers: user.followers,
//     followings: user.followings,
//   };
//   const token = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     config.jwt_access_expires_in as string
//   );
//   const refreshToken = createToken(
//     jwtPayload,
//     config.jwt_refresh_secret as string,
//     config.jwt_refresh_expires_in as string
//   );
//   const { password, ...userWithoutPassword } = user.toObject();
//   return {
//     token,
//     refreshToken,
//     user: userWithoutPassword,
//   };
// };
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: payload.email })
        .select("+password") // Include the password field to verify login
        .populate("followers", "-password") // Populate followers excluding password
        .populate("followings", "-password"); // Populate followings excluding password
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const jwtPayload = {
        sub: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        img: user.img,
        role: user.role,
        bio: user.bio,
        address: user.address,
        verified: user.verified,
        followers: user.followers, // Include populated followers
        followings: user.followings, // Include populated followings
    };
    const token = (0, user_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    const _b = user.toObject(), { password } = _b, userWithoutPassword = __rest(_b, ["password"]);
    return {
        token,
        refreshToken,
        user: userWithoutPassword, // Return user data without password
    };
});
// Refresh access token
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, user_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const { email } = decoded;
    const user = yield user_model_1.User.isUserExists(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found!");
    }
    const jwtPayload = { role: user.role };
    const accessToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return { accessToken };
});
// Get all users
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.find({});
});
// Update user role
const updateUserRole = (userId, newRole) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    user.role = newRole;
    yield user.save();
    return user;
});
// Update user information
const updateUserInfo = (_id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the user by ID and update the data
    const user = yield user_model_1.User.findByIdAndUpdate(_id, updatedData, {
        new: true, // Return the updated document
        runValidators: true, // Ensure data is validated
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    return user;
});
exports.updateUserInfo = updateUserInfo;
// Service to toggle follow/unfollow functionality
const toggleFollowUser = (currentUserId, targetUserId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the current user by ID
    const currentUser = yield user_model_1.User.findById(currentUserId);
    // Find the target user by ID
    const targetUser = yield user_model_1.User.findById(targetUserId);
    // If either user is not found, throw an error
    if (!currentUser || !targetUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    // Ensure followings array is not undefined
    currentUser.followings = currentUser.followings || [];
    // Check if currentUser is already following the targetUser
    const isFollowing = currentUser.followings.some((followId) => followId.toString() === targetUserId);
    if (isFollowing) {
        // If already following, remove the follow relationship (Unfollow)
        currentUser.followings = currentUser.followings.filter((followId) => followId.toString() !== targetUserId);
        targetUser.followers = targetUser.followers.filter((followerId) => followerId.toString() !== currentUserId);
    }
    else {
        // If not following, add the follow relationship (Follow)
        currentUser.followings.push(targetUser._id);
        targetUser.followers.push(currentUser._id);
    }
    // Save both user documents after updating
    yield currentUser.save();
    yield targetUser.save();
    // Populate followers and followings to return full user information
    yield currentUser.populate("followings", "-password");
    yield targetUser.populate("followers", "-password");
    return {
        currentUser,
        targetUser,
        isFollowing: !isFollowing, // Return the opposite of current state
    };
});
// Verify a user
const verifyUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const transactionId = `TXN-${Date.now()}`;
    const paymentData = {
        tran_id: transactionId,
        price: 50,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone,
        userAddress: user.address,
    };
    const paymentSession = yield (0, payment_utils_1.initiatePayment)(paymentData);
    if (paymentSession.status !== 200) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Payment initiation failed");
    }
    // Return an object containing both paymentSession and user
    return { paymentSession, user };
});
const deleteUserFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndDelete(userId);
    return result;
});
// Export UserServices
exports.UserServices = {
    createUserIntoDB,
    loginUser,
    refreshToken,
    getAllUsers,
    updateUserRole,
    updateUserInfo: exports.updateUserInfo,
    toggleFollowUser,
    verifyUser,
    deleteUserFromDB,
};
