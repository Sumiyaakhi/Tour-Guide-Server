import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthService } from "./auth.service";

// Forgot Password (send password reset email)
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    await AuthService.sendPasswordResetEmail(email);
    res
      .status(httpStatus.OK)
      .json({ message: "Password reset email sent successfully." });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

// Reset Password (with token)
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  try {
    await AuthService.resetPassword(token, newPassword);
    res
      .status(httpStatus.OK)
      .json({ message: "Password has been reset successfully." });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({ message: error.message as any });
  }
};

// Change password for authenticated users
export const changePassword = async (req: Request, res: Response) => {
  const userId = req.user._id; // Assuming JWT middleware attaches user ID
  const { oldPassword, newPassword } = req.body;

  try {
    await AuthService.changePassword(userId, oldPassword, newPassword);
    res
      .status(httpStatus.OK)
      .json({ message: "Password changed successfully" });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};
