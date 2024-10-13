"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../middlewares/auth"));
const user_constant_1 = require("./user.constant");
const multer_config_1 = require("../../config/multer.config");
const validateImageFileRequest_1 = __importDefault(require("../middlewares/validateImageFileRequest"));
const image_validation_1 = require("../../zod/image.validation");
const bodyParser_1 = require("../middlewares/bodyParser");
const router = express_1.default.Router();
// Route to get all users (only accessible to admins)
router.get("/users", 
// auth(USER_ROLE.admin), // Only admins can fetch the users
user_controller_1.UserControllers.getAllUsers // Controller to handle fetching users
);
// Route to update user roles (admin-only access)
router.patch("/user/:userId", // Use a dynamic route to specify the user being updated
(0, auth_1.default)(user_constant_1.USER_ROLE.admin), // Only admins can update roles
(0, validateRequest_1.default)(user_validation_1.userValidation.updateUserRoleValidationSchema), // Validation for role updates
user_controller_1.UserControllers.updateUserRole // Controller to handle role updates
);
// Route to update user information (accessible to authenticated users)
router.put("/user/:id", // The dynamic ID for the user being updated
(0, auth_1.default)(user_constant_1.USER_ROLE.user), // Only authenticated users can update their info
multer_config_1.multerUpload.fields([{ name: "postImages" }]), // Changed 'itemImages' to 'postImages'
(0, validateImageFileRequest_1.default)(image_validation_1.ImageFilesArrayZodSchema), bodyParser_1.parseBody, (0, validateRequest_1.default)(user_validation_1.userValidation.updateUserValidationSchema), // User info validation
user_controller_1.UserControllers.updateUserInfo // Controller for updating user info
);
// Route for user signup
router.post("/signup", (0, validateRequest_1.default)(user_validation_1.userValidation.createUserValidationSchema), // Validate the signup data
user_controller_1.UserControllers.createUser // Controller for user creation
);
// Route for user login
router.post("/login", (0, validateRequest_1.default)(user_validation_1.userValidation.loginValidationSchema), // Validate login data
user_controller_1.UserControllers.loginUser // Controller for user login
);
// Route to refresh token
router.post("/refresh-token", (0, validateRequest_1.default)(user_validation_1.userValidation.refreshTokenValidationSchema), // Validate the refresh token request
user_controller_1.UserControllers.refreshToken // Controller for token refresh
);
// Route for following a user (accessible to authenticated users)
router.post("/follow", // User ID of the target user
(0, auth_1.default)(user_constant_1.USER_ROLE.user), // Only authenticated users can follow
user_controller_1.UserControllers.toggleFollowController // Controller to handle following a user
);
// Route for unfollowing a user (accessible to authenticated users)
// router.post(
//   "/unfollow/:userId", // User ID of the target user
//   auth(USER_ROLE.user), // Only authenticated users can unfollow
//   UserControllers.unfollowUser // Controller to handle unfollowing a user
// );
// Route for verifying a user (admin-only access)
router.patch("/verify/:userId", // User ID of the user to be verified
(0, auth_1.default)(user_constant_1.USER_ROLE.user), // Only admins can verify users
user_controller_1.UserControllers.verifyUser // Controller for verifying a user
);
// Route to delete a comment
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), user_controller_1.UserControllers.deleteUser);
exports.UserRoutes = router;
