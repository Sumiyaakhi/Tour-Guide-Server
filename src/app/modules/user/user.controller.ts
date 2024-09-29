import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { NextFunction, Request, Response } from "express";
import config from "../../config";

const createUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const password = user.password;
    const result = await UserServices.createUserIntoDB(password, user);

    res.status(200).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "User registered successfully",
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

const loginUser = catchAsync(async (req, res) => {
  const result = await UserServices.loginUser(req.body);
  const { token } = result;
  const user = result.user;
  const { refreshToken } = result;
  console.log(refreshToken);
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully!",
    token,
    data: user,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await UserServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token is retrieved succesfully!",
    data: result,
  });
});

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserServices.getAllUsers();
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to update a user's role
const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params; // Get userId from route parameters
    const { role } = req.body; // Get new role from request body

    const updatedUser = await UserServices.updateUserRole(userId, role);

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
};
const updateUserInfo = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  // Get user ID from URL parameters
  const updatedData = req.body; // Get updated data from request body

  // Call the service to update user information
  const user = await UserServices.updateUserInfo(userId, updatedData);

  // If user is found and updated, send a successful response
  res.status(httpStatus.OK).json({
    success: true,
    message: "User updated successfully",
    data: user, // Return the updated user data
  });
});

export const UserControllers = {
  createUser,
  loginUser,
  refreshToken,
  getAllUsers,
  updateUserRole,
  updateUserInfo,
};
