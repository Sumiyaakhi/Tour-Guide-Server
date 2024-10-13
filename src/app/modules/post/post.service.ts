import QueryBuilder from "../../builder/QueryBuilder";
import { TImageFiles } from "../../interface/image.interface";
import meiliClient from "../../utils/meilisearch";
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
  // const {
  //   _id,
  //   title,
  //   content,
  //   user,
  //   images: postThumbnails,
  //   category,
  //   premium,
  // } = result;
  // await meiliClient
  //   .index("post")
  //   .addDocuments([
  //     {
  //       _id: _id.toString(),
  //       title,
  //       content,
  //       user,
  //       images: postThumbnails,
  //       category,
  //       premium,
  //     },
  //   ]);

  return result;
};

import { SortOrder } from "mongoose"; // Import SortOrder from mongoose

const getAllPostsFromDB = async (query: Record<string, unknown>) => {
  // Initialize an empty query object for MongoDB
  const mongoQuery: Record<string, unknown> = {};

  // Check if userId is present in the query and add it to the mongoQuery
  if (query.user) {
    mongoQuery.user = query.user; // Adjust this if you're storing the user ID differently
  }

  // Initialize the $or array for search criteria
  const searchConditions = [];

  // Check if searchTerm is present
  if (query.searchBy) {
    const searchRegex = new RegExp(query.searchBy as string, "i"); // Case-insensitive regex search
    searchConditions.push(
      { title: searchRegex },
      { content: searchRegex },
      { "user.name": searchRegex } // Assuming user field is populated with the name
    );
  }

  // If there are search conditions, add them to the mongoQuery
  if (searchConditions.length > 0) {
    mongoQuery.$or = searchConditions;
  }

  // Handle category filtering
  if (query.category) {
    mongoQuery.category = query.category; // Assuming `category` is an ObjectId or a string
  }

  // Building the main query using the QueryBuilder utility
  const postQuery = new QueryBuilder(
    Post.find(mongoQuery) // Pass the mongoQuery to filter posts
      .populate("user") // Populate the post user
      .populate("category") // Populate the post category
      .populate({
        path: "comments.commenter", // Populate the commenter field within each comment
      }),
    query
  )
    .filter()
    .search(PostsSearchableFields) // Search in searchable fields
    .sort()
    .fields(); // Select specific fields (if needed)

  // Handle sorting based on upvotes and downvotes
  if (query.sort) {
    const sortField: Record<string, SortOrder> =
      query.sort === "upvotes" ? { upvotes: -1 } : { downvotes: -1 };
    postQuery.modelQuery = postQuery.modelQuery.sort(sortField); // Apply sorting
  }

  // Execute the query and return the result
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
