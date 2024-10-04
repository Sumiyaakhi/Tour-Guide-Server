import QueryBuilder from "../../builder/QueryBuilder";
import { TImageFiles } from "../../interface/image.interface";
import { PostsSearchableFields } from "./post.constant";
import { IComment, TPost } from "./post.interface";
import { Post } from "./post.model";
import {
  SearchPostByDateRangeQueryMaker,
  SearchPostByUserQueryMaker,
} from "./post.utils";

const createPostIntoDB = async (payload: TPost, images: TImageFiles) => {
  const { postImages } = images;
  console.log(postImages);
  payload.images = postImages.map((image: any) => image.path);
  console.log(postImages);
  const result = await Post.create(payload);

  return result;
};

const getAllPostsFromDB = async (query: Record<string, unknown>) => {
  query = (await SearchPostByUserQueryMaker(query)) || query;

  // Date range search
  query = (await SearchPostByDateRangeQueryMaker(query)) || query;

  const postQuery = new QueryBuilder(
    Post.find()
      .populate("user") // Populate the post user
      .populate("category") // Populate the post category
      .populate({
        path: "comments.commenter", // Populate the commenter field within each comment
      }),
    query
  )
    .filter()
    .search(PostsSearchableFields)
    .sort()
    .fields();

  const result = await postQuery.modelQuery;

  return result;
};

const getPostFromDB = async (postId: string) => {
  const result = await Post.findById(postId)
    .populate("user")
    .populate("category");
  return result;
};

const updatePostInDB = async (postId: string, payload: TPost) => {
  const result = await Post.findByIdAndUpdate(postId, payload, { new: true });
  // if (result) {
  //   await addDocumentToIndex(result, 'posts');
  // } else {
  //   throw new Error(`Post with ID ${postId} not found.`);
  // }
  return result;
};

const updateUpvoteFromPost = async (
  postId: string,
  upvoteCount: number
): Promise<TPost | null> => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { upvote: 1 } }, // Increment the upvote count
      { new: true } // Return the updated document
    );

    return updatedPost; // Return the updated post
  } catch (error) {
    console.error("Error in upvotePost service:", error);
    throw new Error("Could not upvote the post"); // Throw an error to be caught in the controller
  }
};

// Update downvote for a post
const updateDownvoteFromPost = async (
  postId: string,
  downvoteCount: number
): Promise<TPost | null> => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { downvote: 1 } },
      { new: true }
    );

    return updatedPost;
  } catch (error) {
    throw new Error(`Error updating downvote: ${error}`);
  }
};

const decreaseUpvoteFromPost = async (
  postId: string
): Promise<TPost | null> => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { upvote: -1 } }, // Decrement the upvote count
      { new: true } // Return the updated document
    );

    return updatedPost; // Return the updated post
  } catch (error) {
    console.error("Error in decreaseUpvoteFromPost service:", error);
    throw new Error("Could not decrease the upvote"); // Throw an error to be caught in the controller
  }
};

// Decrease downvote count for a post
const decreaseDownvoteFromPost = async (
  postId: string
): Promise<TPost | null> => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { downvote: -1 } }, // Decrement the downvote count
      { new: true } // Return the updated document
    );

    return updatedPost; // Return the updated post
  } catch (error) {
    console.error("Error in decreaseDownvoteFromPost service:", error);
    throw new Error("Could not decrease the downvote"); // Throw an error to be caught in the controller
  }
};

// Update or add a comment to a post
const addCommentOnPost = async (
  postId: string,
  commenterId: string,
  comment: string
) => {
  const newComment = {
    comment,
    commenter: commenterId,
  };

  // Find the post by ID and push the new comment to the comments array
  const updatedPost = await Post.findByIdAndUpdate(
    postId, // First argument should be the post ID
    { $push: { comments: newComment } }, // Pushing new comment to the comments array
    { new: true } // Return the updated post
  );

  return updatedPost;
};
// Update a specific comment on a post
const updateComment = async (
  postId: string,
  commentId: string,
  newComment: string
) => {
  // Find the post containing the comment and update the specific comment
  const post = await Post.findOneAndUpdate(
    { _id: postId, "comments._id": commentId }, // Match post and specific comment
    { $set: { "comments.$.comment": newComment } }, // Use positional operator `$` to update the specific comment
    { new: true } // Return the updated document
  );

  if (!post) {
    throw new Error("Post or comment not found");
  }

  return post; // Return the updated post with the updated comment
};

const deleteComment = async (postId: string, commentId: string) => {
  // Find the post and delete the comment from the array
  const post = await Post.findByIdAndUpdate(
    postId,
    { $pull: { comments: { _id: commentId } } }, // Pull the comment from the array
    { new: true } // Return the updated document
  );

  if (!post) {
    throw new Error("Post or comment not found");
  }

  return post; // Return the updated post
};

const deletePostFromDB = async (postId: string) => {
  const result = await Post.findByIdAndDelete(postId);
  // const deletedPostId = result?._id;
  // if (deletedPostId) {
  //   await deleteDocumentFromIndex('posts', deletedPostId.toString());
  // }
  return result;
};

export const PostServices = {
  createPostIntoDB,
  getAllPostsFromDB,
  getPostFromDB,
  updatePostInDB,
  deletePostFromDB,
  updateUpvoteFromPost,
  updateDownvoteFromPost,
  addCommentOnPost,
  deleteComment,
  updateComment,
  decreaseDownvoteFromPost,
  decreaseUpvoteFromPost,
};
