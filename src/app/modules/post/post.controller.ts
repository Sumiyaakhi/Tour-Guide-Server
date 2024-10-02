import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { PostServices } from "./post.service";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../error/AppError";
import { TImageFiles } from "../../interface/image.interface";

const createPost = catchAsync(async (req: Request, res: Response) => {
  if (!req.files) {
    throw new AppError(400, "Please upload an image");
  }
  console.log(req.files);
  console.log(req.body);
  const post = await PostServices.createPostIntoDB(
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post created successfully",
    data: post,
  });
});

const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const posts = await PostServices.getAllPostsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts retrieved successfully",
    data: posts,
  });
});

const getPost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id;
  const post = await PostServices.getPostFromDB(postId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post retrieved successfully",
    data: post,
  });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedPost = await PostServices.updatePostInDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post updated successfully",
    data: updatedPost,
  });
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await PostServices.deletePostFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post deleted successfully",
    data: null,
  });
});

export const PostControllers = {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
};
