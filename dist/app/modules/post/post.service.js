"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const post_constant_1 = require("./post.constant");
const post_model_1 = require("./post.model");
const post_utils_1 = require("./post.utils");
const createPostIntoDB = (payload, images) => __awaiter(void 0, void 0, void 0, function* () {
    const { postImages } = images;
    console.log(postImages);
    payload.images = postImages.map((image) => image.path);
    console.log(postImages);
    const result = yield post_model_1.Post.create(payload);
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
});
const getAllPostsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // Generate user-based queries (e.g., filter by user)
    query = (yield (0, post_utils_1.SearchPostByUserQueryMaker)(query)) || query;
    // Generate date range queries (if applicable)
    query = (yield (0, post_utils_1.SearchPostByDateRangeQueryMaker)(query)) || query;
    // Add search term logic
    if (query.searchTerm) {
        const searchRegex = new RegExp(query.searchTerm, "i"); // Case-insensitive regex search
        query.$or = [
            { title: searchRegex },
            { content: searchRegex },
            { "user.name": searchRegex }, // Assuming user field is populated with the name
        ];
        delete query.searchTerm; // Remove `searchTerm` from the query since it's already handled
    }
    // Handle category filtering
    if (query.category) {
        query.category = query.category; // Assuming `category` is an ObjectId or a string
    }
    // Building the main query using the QueryBuilder utility
    const postQuery = new QueryBuilder_1.default(post_model_1.Post.find()
        .populate("user") // Populate the post user
        .populate("category") // Populate the post category
        .populate({
        path: "comments.commenter", // Populate the commenter field within each comment
    }), query)
        .filter()
        .search(post_constant_1.PostsSearchableFields) // Search in searchable fields
        .sort() // Apply sorting (if any)
        .fields(); // Select specific fields (if needed)
    // Execute the query and return the result
    const result = yield postQuery.modelQuery;
    return result;
});
const getPostFromDB = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findById(postId)
        .populate("user")
        .populate("category");
    return result;
});
const updatePostInDB = (postId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findByIdAndUpdate(postId, payload, { new: true });
    // if (result) {
    //   await addDocumentToIndex(result, 'posts');
    // } else {
    //   throw new Error(`Post with ID ${postId} not found.`);
    // }
    return result;
});
const updateUpvoteFromPost = (postId, upvoteCount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedPost = yield post_model_1.Post.findByIdAndUpdate(postId, { $inc: { upvote: 1 } }, // Increment the upvote count
        { new: true } // Return the updated document
        );
        return updatedPost; // Return the updated post
    }
    catch (error) {
        console.error("Error in upvotePost service:", error);
        throw new Error("Could not upvote the post"); // Throw an error to be caught in the controller
    }
});
// Update downvote for a post
const updateDownvoteFromPost = (postId, downvoteCount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedPost = yield post_model_1.Post.findByIdAndUpdate(postId, { $inc: { downvote: 1 } }, { new: true });
        return updatedPost;
    }
    catch (error) {
        throw new Error(`Error updating downvote: ${error}`);
    }
});
const decreaseUpvoteFromPost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedPost = yield post_model_1.Post.findByIdAndUpdate(postId, { $inc: { upvote: -1 } }, // Decrement the upvote count
        { new: true } // Return the updated document
        );
        return updatedPost; // Return the updated post
    }
    catch (error) {
        console.error("Error in decreaseUpvoteFromPost service:", error);
        throw new Error("Could not decrease the upvote"); // Throw an error to be caught in the controller
    }
});
// Decrease downvote count for a post
const decreaseDownvoteFromPost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedPost = yield post_model_1.Post.findByIdAndUpdate(postId, { $inc: { downvote: -1 } }, // Decrement the downvote count
        { new: true } // Return the updated document
        );
        return updatedPost; // Return the updated post
    }
    catch (error) {
        console.error("Error in decreaseDownvoteFromPost service:", error);
        throw new Error("Could not decrease the downvote"); // Throw an error to be caught in the controller
    }
});
// Update or add a comment to a post
const addCommentOnPost = (postId, commenterId, comment) => __awaiter(void 0, void 0, void 0, function* () {
    const newComment = {
        comment,
        commenter: commenterId,
    };
    // Find the post by ID and push the new comment to the comments array
    const updatedPost = yield post_model_1.Post.findByIdAndUpdate(postId, // First argument should be the post ID
    { $push: { comments: newComment } }, // Pushing new comment to the comments array
    { new: true } // Return the updated post
    );
    return updatedPost;
});
// Update a specific comment on a post
const updateComment = (postId, commentId, newComment) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the post containing the comment and update the specific comment
    const post = yield post_model_1.Post.findOneAndUpdate({ _id: postId, "comments._id": commentId }, // Match post and specific comment
    { $set: { "comments.$.comment": newComment } }, // Use positional operator `$` to update the specific comment
    { new: true } // Return the updated document
    );
    if (!post) {
        throw new Error("Post or comment not found");
    }
    return post; // Return the updated post with the updated comment
});
const deleteComment = (postId, commentId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the post and delete the comment from the array
    const post = yield post_model_1.Post.findByIdAndUpdate(postId, { $pull: { comments: { _id: commentId } } }, // Pull the comment from the array
    { new: true } // Return the updated document
    );
    if (!post) {
        throw new Error("Post or comment not found");
    }
    return post; // Return the updated post
});
const deletePostFromDB = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.Post.findByIdAndDelete(postId);
    // const deletedPostId = result?._id;
    // if (deletedPostId) {
    //   await deleteDocumentFromIndex('posts', deletedPostId.toString());
    // }
    return result;
});
exports.PostServices = {
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
