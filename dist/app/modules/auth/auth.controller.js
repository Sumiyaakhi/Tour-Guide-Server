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
exports.changePassword = exports.resetPassword = exports.forgotPassword = void 0;
const http_status_1 = __importDefault(require("http-status"));
const auth_service_1 = require("./auth.service");
// Forgot Password (send password reset email)
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        yield auth_service_1.AuthService.sendPasswordResetEmail(email);
        res
            .status(http_status_1.default.OK)
            .json({ message: "Password reset email sent successfully." });
    }
    catch (error) {
        res.status(http_status_1.default.BAD_REQUEST).json({ message: error.message });
    }
});
exports.forgotPassword = forgotPassword;
// Reset Password (with token)
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPassword } = req.body;
    try {
        yield auth_service_1.AuthService.resetPassword(token, newPassword);
        res
            .status(http_status_1.default.OK)
            .json({ message: "Password has been reset successfully." });
    }
    catch (error) {
        res.status(http_status_1.default.BAD_REQUEST).json({ message: error.message });
    }
});
exports.resetPassword = resetPassword;
// Change password for authenticated users
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id; // Assuming JWT middleware attaches user ID
    const { oldPassword, newPassword } = req.body;
    try {
        yield auth_service_1.AuthService.changePassword(userId, oldPassword, newPassword);
        res
            .status(http_status_1.default.OK)
            .json({ message: "Password changed successfully" });
    }
    catch (error) {
        res.status(http_status_1.default.BAD_REQUEST).json({ message: error.message });
    }
});
exports.changePassword = changePassword;
