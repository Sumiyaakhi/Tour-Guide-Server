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
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_model_1 = require("../user/user.model");
const http_status_1 = __importDefault(require("http-status"));
const user_utils_1 = require("../user/user.utils");
const sendEmail_1 = require("../../utils/sendEmail");
// Ensure user exists before accessing email, so we can assert email is not undefined
const sendPasswordResetEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user || !user.email) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User with this email does not exist");
    }
    // Create reset token using user's email
    const resetToken = (0, user_utils_1.createToken)({ email: user === null || user === void 0 ? void 0 : user.email }, // Now we know user.email is defined
    config_1.default.jwt_refresh_secret, "1h");
    const resetLink = `${config_1.default.client_url}/reset-password?token=${resetToken}`;
    const emailContent = `<p>Click this <a href="${resetLink}">link</a> to reset your password.</p>`;
    // Send email
    yield (0, sendEmail_1.sendEmail)(user.email, "Password Reset Request", emailContent);
});
// Reset Password using Token
const resetPassword = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedToken;
    try {
        decodedToken = (0, user_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired token");
    }
    const { email } = decodedToken;
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
    user.password = hashedPassword;
    yield user.save();
});
// Change Password for logged-in users
const changePassword = (userId, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("+password");
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const isPasswordCorrect = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Incorrect old password");
    }
    user.password = yield bcryptjs_1.default.hash(newPassword, 10);
    yield user.save();
});
exports.AuthService = {
    changePassword,
    sendPasswordResetEmail,
    resetPassword,
};
