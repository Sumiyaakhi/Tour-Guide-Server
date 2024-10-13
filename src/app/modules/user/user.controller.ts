import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { NextFunction, Request, Response } from "express";
import config from "../../config";
import { cloudinaryUpload } from "../../config/cloudinary.config";

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

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: "User logged in successfully!",
    accessToken: token,
    refreshToken,
    data: user,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await UserServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token retrieved successfully!",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await UserServices.getAllUsers();
  res.status(httpStatus.OK).json({
    success: true,
    data: users,
  });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { role } = req.body;

  const updatedUser = await UserServices.updateUserRole(userId, role);

  res.status(httpStatus.OK).json({
    success: true,
    message: "User role updated successfully",
    data: updatedUser,
  });
});

export const updateUserInfo = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.id;
    const updatedData = req.body;

    // If there is a file in the request, handle Cloudinary upload
    if (req.files) {
      const postImage = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )["postImages"][0];

      // Upload to Cloudinary
      const result = await cloudinaryUpload.uploader.upload(postImage.path, {
        folder: "profile_pictures", // Save images in this folder in Cloudinary
      });

      // Add the Cloudinary image URL to the updatedData object
      updatedData.img = result.secure_url;
    }

    // Call the service to update the user data
    const updatedUser = await UserServices.updateUserInfo(userId, updatedData);

    res.status(httpStatus.OK).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  }
);

// Follow/Unfollow Controller
const toggleFollowController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentUserId, targetUserId } = req.body; // Assuming user ID is available in req.body
    console.log(currentUserId, targetUserId);

    // Call the toggleFollowUser function to handle follow/unfollow logic
    const { currentUser, targetUser, isFollowing } =
      await UserServices.toggleFollowUser(currentUserId, targetUserId);

    // Return updated users and follow status
    res.status(200).json({
      message: `You have successfully ${
        isFollowing ? "followed" : "unfollowed"
      } the user.`,
      currentUser, // Includes populated followings
      targetUser, // Includes populated followers
    });
  } catch (error: any) {
    next(error); // Pass error to the next middleware (error handler)
  }
};

const verifyUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const result = await UserServices.verifyUser(userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "User verified successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await UserServices.deleteUserFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post deleted successfully",
    data: null,
  });
});

export const UserControllers = {
  createUser,
  loginUser,
  refreshToken,
  getAllUsers,
  updateUserRole,
  updateUserInfo,
  verifyUser,
  toggleFollowController,
  deleteUser,
};
