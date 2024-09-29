import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import auth from "../middlewares/auth";
import { USER_ROLE } from "./user.constant";

const router = express.Router();

// router.get(
//   "/users",
//   auth(USER_ROLE.admin), // Only admins can fetch the users
//   UserControllers.getAllUsers // Controller to handle fetching users
// );

// // Route for updating user roles (PATCH request)
// router.patch(
//   "/users/:userId", // Use a dynamic route to specify the user being updated
//   auth(USER_ROLE.admin), // Only admins can update roles
//   validateRequest(userValidation.updateUserRoleValidationSchema), // Specific validation for role updates
//   UserControllers.updateUserRole // Controller to handle the role update
// );
// Route for updating user Information (PUT request)
router.put(
  "/:id",
  auth(USER_ROLE.user),
  validateRequest(userValidation.updateUserValidationSchema),
  UserControllers.updateUserInfo
);
router.post(
  "/signup",
  validateRequest(userValidation.createUserValidationSchema),
  UserControllers.createUser
);
router.post(
  "/login",
  validateRequest(userValidation.loginValidationSchema),
  UserControllers.loginUser
);
router.post(
  "/refresh-token",
  validateRequest(userValidation.refreshTokenValidationSchema),
  UserControllers.refreshToken
);

export const UserRoutes = router;
