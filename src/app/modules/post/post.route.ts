import express from "express";

import {
  addComment,
  decreaseDownvote,
  decreaseUpvote,
  PostControllers,
  updateDownvote,
  updateUpvote,
} from "./post.controller"; // Changed 'item' to 'post'
import { PostValidation } from "./post.validation"; // Changed 'item' to 'post'
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import { multerUpload } from "../../config/multer.config";
import { ImageFilesArrayZodSchema } from "../../zod/image.validation";
import validateImageFileRequest from "../middlewares/validateImageFileRequest";
import { parseBody } from "../middlewares/bodyParser";

const router = express.Router();

router.post(
  "/",

  multerUpload.fields([{ name: "postImages" }]), // Changed 'itemImages' to 'postImages'
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(PostValidation.createPostValidationSchema), // Updated 'createItemValidationSchema' to 'createPostValidationSchema'
  PostControllers.createPost // Updated controller reference
);

router.get("/", PostControllers.getAllPosts); // Updated 'getAllItems' to 'getAllPosts'

router.get("/:id", PostControllers.getPost); // Updated 'getItem' to 'getPost'

router.put(
  "/:id",
  // multerUpload.fields([{ name: "commentImages" }]),
  validateRequest(PostValidation.updatePostValidationSchema), // Updated 'updateItemValidationSchema' to 'updatePostValidationSchema'
  PostControllers.updatePost // Updated controller reference
);

// Update upvote
router.put("/upvoteInc/:postId", auth(USER_ROLE.user), updateUpvote);

// Update downvote
router.put("/downvoteInc/:postId", auth(USER_ROLE.user), updateDownvote);
// Update upvote
router.put("/upvoteDec/:postId", auth(USER_ROLE.user), decreaseUpvote);

// Update downvote
router.put("/downvoteDec/:postId", auth(USER_ROLE.user), decreaseDownvote);
// Update comment on a post
router.put("/comment/:postId", auth(USER_ROLE.user), addComment);
router.delete("/:id", PostControllers.deletePost); // Updated 'deleteItem' to 'deletePost'

// Route to update a comment
router.put(
  "/:postId/comment/:commentId",
  auth(USER_ROLE.user),
  PostControllers.updateCommentController
);

// Route to delete a comment
router.delete(
  "/:postId/comment/:commentId",
  auth(USER_ROLE.user),
  PostControllers.deleteCommentController
);

export const PostRoutes = router; // Changed 'ItemRoutes' to 'PostRoutes'
