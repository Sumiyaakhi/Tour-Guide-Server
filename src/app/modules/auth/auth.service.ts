import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../../config";

import AppError from "../../error/AppError";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import { createToken, verifyToken } from "../user/user.utils";
import { sendEmail } from "../../utils/sendEmail";

type JwtPayload = {
  role: string;
  email?: string; // Optionally include email if it's sometimes included
};

// Ensure user exists before accessing email, so we can assert email is not undefined
const sendPasswordResetEmail = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user || !user.email) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User with this email does not exist"
    );
  }

  // Create reset token using user's email
  const resetToken = createToken(
    { email: user?.email }, // Now we know user.email is defined
    config.jwt_refresh_secret as string,
    "1h"
  );

  const resetLink = `${config.client_url}/reset-password?token=${resetToken}`;
  const emailContent = `<p>Click this <a href="${resetLink}">link</a> to reset your password.</p>`;

  // Send email
  await sendEmail(user.email, "Password Reset Request", emailContent);
};

// Reset Password using Token
const resetPassword = async (token: string, newPassword: string) => {
  let decodedToken;

  try {
    decodedToken = verifyToken(token, config.jwt_refresh_secret as string);
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
  }

  const { email } = decodedToken;
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  await user.save();
};

// Change Password for logged-in users
const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordCorrect) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect old password");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
};

export const AuthService = {
  changePassword,
  sendPasswordResetEmail,
  resetPassword,
};
