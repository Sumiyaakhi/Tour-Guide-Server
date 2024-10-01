import httpStatus from "http-status";
import { TLoginUser, TUser } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../error/AppError";
import jwt from "jsonwebtoken";
import config from "../../config";
import { createToken, verifyToken } from "./user.utils";

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

const loginUser = async (payload: TLoginUser) => {
  // Find user and explicitly select password field
  const user = await User.findOne({ email: payload.email }).select("+password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Create token and send to the user/client
  const jwtPayload = {
    sub: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    img: user.img,
    role: user.role,
    address: user.address,
  };
  const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "10d",
  });

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );
  // Return user details excluding password
  const { password, ...userWithoutPassword } = user.toObject();

  return {
    token,
    refreshToken,
    user: userWithoutPassword,
  };
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { email, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExists(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  const jwtPayload = { role: user.role };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  return {
    accessToken,
  };
};

const getAllUsers = async () => {
  const users = await User.find({});
  return users;
};

// Update a user's role by userId
const updateUserRole = async (userId: String, newRole: "admin" | "user") => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.role = newRole;
  await user.save();
  return user;
};
const updateUserInfo = async (id: string, updatedData: Partial<TUser>) => {
  const user = await User.findByIdAndUpdate(id, updatedData, {
    new: true, // Return the updated user
    runValidators: true, // Ensure validation is run on the updated data
  });

  // If no user is found, throw a "User not found" error
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user; // Return the updated user data
};

export const UserServices = {
  createUserIntoDB,
  loginUser,
  refreshToken,
  getAllUsers,
  updateUserRole,
  updateUserInfo,
};
