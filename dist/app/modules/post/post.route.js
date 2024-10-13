"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRoutes = void 0;
const express_1 = __importDefault(require("express"));
const post_controller_1 = require("./post.controller"); // Changed 'item' to 'post'
const post_validation_1 = require("./post.validation"); // Changed 'item' to 'post'
const auth_1 = __importDefault(require("../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const multer_config_1 = require("../../config/multer.config");
const image_validation_1 = require("../../zod/image.validation");
const validateImageFileRequest_1 = __importDefault(require("../middlewares/validateImageFileRequest"));
const bodyParser_1 = require("../middlewares/bodyParser");
const router = express_1.default.Router();
router.post("/", multer_config_1.multerUpload.fields([{ name: "postImages" }]), // Changed 'itemImages' to 'postImages'
(0, validateImageFileRequest_1.default)(image_validation_1.ImageFilesArrayZodSchema), bodyParser_1.parseBody, (0, validateRequest_1.default)(post_validation_1.PostValidation.createPostValidationSchema), // Updated 'createItemValidationSchema' to 'createPostValidationSchema'
post_controller_1.PostControllers.createPost // Updated controller reference
);
router.get("/", post_controller_1.PostControllers.getAllPosts); // Updated 'getAllItems' to 'getAllPosts'
router.get("/:id", post_controller_1.PostControllers.getPost); // Updated 'getItem' to 'getPost'
router.put("/:id", 
// multerUpload.fields([{ name: "commentImages" }]),
(0, validateRequest_1.default)(post_validation_1.PostValidation.updatePostValidationSchema), // Updated 'updateItemValidationSchema' to 'updatePostValidationSchema'
post_controller_1.PostControllers.updatePost // Updated controller reference
);
// Update upvote
router.put("/upvoteInc/:postId", (0, auth_1.default)(user_constant_1.USER_ROLE.user), post_controller_1.updateUpvote);
// Update downvote
router.put("/downvoteInc/:postId", (0, auth_1.default)(user_constant_1.USER_ROLE.user), post_controller_1.updateDownvote);
// Update upvote
router.put("/upvoteDec/:postId", (0, auth_1.default)(user_constant_1.USER_ROLE.user), post_controller_1.decreaseUpvote);
// Update downvote
router.put("/downvoteDec/:postId", (0, auth_1.default)(user_constant_1.USER_ROLE.user), post_controller_1.decreaseDownvote);
// Update comment on a post
router.put("/comment/:postId", (0, auth_1.default)(user_constant_1.USER_ROLE.user), post_controller_1.addComment);
router.delete("/:id", post_controller_1.PostControllers.deletePost); // Updated 'deleteItem' to 'deletePost'
// Route to update a comment
router.put("/:postId/comment/:commentId", (0, auth_1.default)(user_constant_1.USER_ROLE.user), post_controller_1.PostControllers.updateCommentController);
// Route to delete a comment
router.delete("/:postId/comment/:commentId", (0, auth_1.default)(user_constant_1.USER_ROLE.user), post_controller_1.PostControllers.deleteCommentController);
exports.PostRoutes = router; // Changed 'ItemRoutes' to 'PostRoutes'
