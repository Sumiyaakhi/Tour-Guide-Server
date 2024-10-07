import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import auth from "../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import { multerUpload } from "../../config/multer.config";
import validateImageFileRequest from "../middlewares/validateImageFileRequest";
import { ImageFilesArrayZodSchema } from "../../zod/image.validation";
import { parseBody } from "../middlewares/bodyParser";

const router = express.Router();

// Route to get all users (only accessible to admins)
router.get(
  "/users",
  auth(USER_ROLE.admin), // Only admins can fetch the users
  UserControllers.getAllUsers // Controller to handle fetching users
);

// Route to update user roles (admin-only access)
router.patch(
  "user/:userId", // Use a dynamic route to specify the user being updated
  auth(USER_ROLE.admin), // Only admins can update roles
  validateRequest(userValidation.updateUserRoleValidationSchema), // Validation for role updates
  UserControllers.updateUserRole // Controller to handle role updates
);

// Route to update user information (accessible to authenticated users)
router.put(
  "/user/:id", // The dynamic ID for the user being updated
  auth(USER_ROLE.user), // Only authenticated users can update their info
  multerUpload.fields([{ name: "postImages" }]), // Changed 'itemImages' to 'postImages'
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(userValidation.updateUserValidationSchema), // User info validation
  UserControllers.updateUserInfo // Controller for updating user info
);

// Route for user signup
router.post(
  "/signup",

  validateRequest(userValidation.createUserValidationSchema), // Validate the signup data
  UserControllers.createUser // Controller for user creation
);

// Route for user login
router.post(
  "/login",
  validateRequest(userValidation.loginValidationSchema), // Validate login data
  UserControllers.loginUser // Controller for user login
);

// Route to refresh token
router.post(
  "/refresh-token",
  validateRequest(userValidation.refreshTokenValidationSchema), // Validate the refresh token request
  UserControllers.refreshToken // Controller for token refresh
);

// Route for following a user (accessible to authenticated users)
router.post(
  "/follow", // User ID of the target user
  auth(USER_ROLE.user), // Only authenticated users can follow
  UserControllers.toggleFollowController // Controller to handle following a user
);

// Route for unfollowing a user (accessible to authenticated users)
// router.post(
//   "/unfollow/:userId", // User ID of the target user
//   auth(USER_ROLE.user), // Only authenticated users can unfollow
//   UserControllers.unfollowUser // Controller to handle unfollowing a user
// );

// Route for verifying a user (admin-only access)
router.patch(
  "/verify/:userId", // User ID of the user to be verified
  auth(USER_ROLE.admin), // Only admins can verify users
  UserControllers.verifyUser // Controller for verifying a user
);

export const UserRoutes = router;
