import httpStatus from "http-status";
import { TLoginUser, TUser } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../error/AppError";
import jwt from "jsonwebtoken";
import config from "../../config";
import { createToken, verifyToken } from "./user.utils";
import { TImageFiles } from "../../interface/image.interface";
import { initiatePayment } from "../payment/payment.utils";

interface PaymentSession {
  status: number;
  paymentUrl: string; // Adjust the type based on the actual structure of paymentSession
}

// Create a new user
const createUserIntoDB = async (password: string, payload: TUser) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, "User already exists");
  }

  // Create new user in the database
  const newUser = await User.create(payload);

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
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string // Configure access token expiration time
  );

  // Create refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string // Configure refresh token expiration time
  );

  // Return user details and tokens (exclude password if necessary)
  const { password: _, ...userWithoutPassword } = newUser.toObject();

  return {
    user: userWithoutPassword, // Exclude password from response
    accessToken,
    refreshToken,
  };
};

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

const loginUser = async (
  payload: TLoginUser
): Promise<{ token: string; refreshToken: string; user: Partial<TUser> }> => {
  const user = await User.findOne({ email: payload.email })
    .select("+password") // Include the password field to verify login
    .populate("followers", "-password") // Populate followers excluding password
    .populate("followings", "-password"); // Populate followings excluding password

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
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

  const token = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  const { password, ...userWithoutPassword } = user.toObject();

  return {
    token,
    refreshToken,
    user: userWithoutPassword, // Return user data without password
  };
};

// Refresh access token
const refreshToken = async (
  token: string
): Promise<{ accessToken: string }> => {
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);
  const { email } = decoded;

  const user = await User.isUserExists(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  const jwtPayload = { role: user.role };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  return { accessToken };
};

// Get all users
const getAllUsers = async (): Promise<TUser[]> => {
  return await User.find({});
};

// Update user role
const updateUserRole = async (
  userId: string,
  newRole: "admin" | "user"
): Promise<TUser> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  user.role = newRole;
  await user.save();
  return user;
};

// Update user information
export const updateUserInfo = async (
  _id: string,
  updatedData: Partial<TUser>
): Promise<TUser | null> => {
  // Find the user by ID and update the data
  const user = await User.findByIdAndUpdate(_id, updatedData, {
    new: true, // Return the updated document
    runValidators: true, // Ensure data is validated
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

// Service to toggle follow/unfollow functionality
const toggleFollowUser = async (
  currentUserId: string,
  targetUserId: string
) => {
  // Find the current user by ID
  const currentUser = await User.findById(currentUserId);

  // Find the target user by ID
  const targetUser = await User.findById(targetUserId);

  // If either user is not found, throw an error
  if (!currentUser || !targetUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  // Ensure followings array is not undefined
  currentUser.followings = currentUser.followings || [];

  // Check if currentUser is already following the targetUser
  const isFollowing = currentUser.followings.some(
    (followId: any) => followId.toString() === targetUserId
  );

  if (isFollowing) {
    // If already following, remove the follow relationship (Unfollow)
    currentUser.followings = currentUser.followings.filter(
      (followId: any) => followId.toString() !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter(
      (followerId: any) => followerId.toString() !== currentUserId
    );
  } else {
    // If not following, add the follow relationship (Follow)
    currentUser.followings.push(targetUser._id as any);
    targetUser.followers.push(currentUser._id as any);
  }

  // Save both user documents after updating
  await currentUser.save();
  await targetUser.save();

  // Populate followers and followings to return full user information
  await currentUser.populate("followings", "-password");
  await targetUser.populate("followers", "-password");

  return {
    currentUser,
    targetUser,
    isFollowing: !isFollowing, // Return the opposite of current state
  };
};

// Verify a user
const verifyUser = async (
  userId: string
): Promise<{ paymentSession: PaymentSession; user: TUser }> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
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

  const paymentSession = await initiatePayment(paymentData);
  if (paymentSession.status !== 200) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Payment initiation failed"
    );
  }

  // Return an object containing both paymentSession and user
  return { paymentSession, user };
};
// Export UserServices
export const UserServices = {
  createUserIntoDB,
  loginUser,
  refreshToken,
  getAllUsers,
  updateUserRole,
  updateUserInfo,
  toggleFollowUser,
  verifyUser,
};
