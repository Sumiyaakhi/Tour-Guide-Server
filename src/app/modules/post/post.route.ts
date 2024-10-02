import express from "express";

import { PostControllers } from "./post.controller"; // Changed 'item' to 'post'
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
  auth(USER_ROLE.user),
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
  auth(USER_ROLE.user),
  validateRequest(PostValidation.updatePostValidationSchema), // Updated 'updateItemValidationSchema' to 'updatePostValidationSchema'
  PostControllers.updatePost // Updated controller reference
);

router.delete("/:id", auth(USER_ROLE.user), PostControllers.deletePost); // Updated 'deleteItem' to 'deletePost'

export const PostRoutes = router; // Changed 'ItemRoutes' to 'PostRoutes'
