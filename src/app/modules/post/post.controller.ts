import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { PostServices } from "./post.service";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../error/AppError";
import { TImageFiles } from "../../interface/image.interface";
import { IComment } from "./post.interface";

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

// Update upvote
export const updateUpvote = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { postId } = req.params; // Getting postId from URL params
  const { upvote } = req.body; // Getting upvote count from the request body

  try {
    const updatedPost = await PostServices.updateUpvoteFromPost(postId, upvote);

    if (!updatedPost) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.status(200).json(updatedPost); // Do not return this
  } catch (error) {
    res.status(500).json({ message: "Error updating upvote", error });
  }
};

// Update downvote
export const updateDownvote = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { postId } = req.params;
  const { downvote } = req.body;

  try {
    const updatedPost = await PostServices.updateDownvoteFromPost(
      postId,
      downvote
    );

    if (!updatedPost) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.status(200).json(updatedPost); // Do not return this
  } catch (error) {
    res.status(500).json({ message: "Error updating downvote", error });
  }
};

export const addComment = async (req: Request, res: Response) => {
  const { commenter, comment } = req.body; // Extract commenter and comment from the body
  const { postId } = req.params; // Extract postId from request params (using /posts/:postId)

  try {
    // Pass postId, commenter, and comment to the service function
    const updatedPost = await PostServices.addCommentOnPost(
      postId,
      commenter,
      comment
    );

    // Respond with the updated post (or you can return the new comment specifically)
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error updating comment", error });
  }
};

// Update a comment
const updateCommentController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { postId, commentId } = req.params;
  const { comment } = req.body;

  // Check if the new comment text is provided
  if (!comment) {
    res.status(400).json({ message: "New comment text is required." });
    return; // Exit early
  }

  // Call the service and handle the promise
  PostServices.updateComment(postId, commentId, comment)
    .then((updatedPost) => {
      res
        .status(200)
        .json({ message: "Comment updated successfully", updatedPost });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Comment is not updated, sorry",
        error: error.message,
      });
    });
};

// Delete a comment
const deleteCommentController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { postId, commentId } = req.params; // Extract IDs from the URL

    const updatedPost = await PostServices.deleteComment(postId, commentId); // Call service to delete the comment

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      data: updatedPost,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error deleting comment",
    });
  }
};
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
  updateCommentController,
  deleteCommentController,
};
