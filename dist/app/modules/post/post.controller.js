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
exports.PostControllers = exports.addComment = exports.decreaseDownvote = exports.decreaseUpvote = exports.updateDownvote = exports.updateUpvote = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const post_service_1 = require("./post.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const createPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        throw new AppError_1.default(400, "Please upload an image");
    }
    // console.log(req.files);
    // console.log(req.body);
    const post = yield post_service_1.PostServices.createPostIntoDB(req.body, req.files);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Post created successfully",
        data: post,
    });
}));
const getAllPosts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield post_service_1.PostServices.getAllPostsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Posts retrieved successfully",
        data: posts,
    });
}));
const getPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const post = yield post_service_1.PostServices.getPostFromDB(postId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Post retrieved successfully",
        data: post,
    });
}));
const updatePost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedPost = yield post_service_1.PostServices.updatePostInDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Post updated successfully",
        data: updatedPost,
    });
}));
// Update upvote
const updateUpvote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params; // Getting postId from URL params
    const { upvote } = req.body; // Getting upvote count from the request body
    try {
        const updatedPost = yield post_service_1.PostServices.updateUpvoteFromPost(postId, upvote);
        if (!updatedPost) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.status(200).json(updatedPost); // Do not return this
    }
    catch (error) {
        res.status(500).json({ message: "Error updating upvote", error });
    }
});
exports.updateUpvote = updateUpvote;
// Update downvote
const updateDownvote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const { downvote } = req.body;
    try {
        const updatedPost = yield post_service_1.PostServices.updateDownvoteFromPost(postId, downvote);
        if (!updatedPost) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.status(200).json(updatedPost); // Do not return this
    }
    catch (error) {
        res.status(500).json({ message: "Error updating downvote", error });
    }
});
exports.updateDownvote = updateDownvote;
// Decrease upvote
const decreaseUpvote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params; // Getting postId from URL params
    try {
        const updatedPost = yield post_service_1.PostServices.decreaseUpvoteFromPost(postId);
        if (!updatedPost) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.status(200).json(updatedPost); // Return the updated post
    }
    catch (error) {
        res.status(500).json({ message: "Error decreasing upvote", error });
    }
});
exports.decreaseUpvote = decreaseUpvote;
// Decrease downvote
const decreaseDownvote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params; // Getting postId from URL params
    try {
        const updatedPost = yield post_service_1.PostServices.decreaseDownvoteFromPost(postId);
        if (!updatedPost) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.status(200).json(updatedPost); // Return the updated post
    }
    catch (error) {
        res.status(500).json({ message: "Error decreasing downvote", error });
    }
});
exports.decreaseDownvote = decreaseDownvote;
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commenter, comment } = req.body; // Extract commenter and comment from the body
    const { postId } = req.params; // Extract postId from request params (using /posts/:postId)
    try {
        // Pass postId, commenter, and comment to the service function
        const updatedPost = yield post_service_1.PostServices.addCommentOnPost(postId, commenter, comment);
        // Respond with the updated post (or you can return the new comment specifically)
        res.status(200).json(updatedPost);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating comment", error });
    }
});
exports.addComment = addComment;
// Update a comment
const updateCommentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, commentId } = req.params;
    const { comment } = req.body;
    // Check if the new comment text is provided
    if (!comment) {
        res.status(400).json({ message: "New comment text is required." });
        return; // Exit early
    }
    // Call the service and handle the promise
    post_service_1.PostServices.updateComment(postId, commentId, comment)
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
});
// Delete a comment
const deleteCommentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, commentId } = req.params; // Extract IDs from the URL
        const updatedPost = yield post_service_1.PostServices.deleteComment(postId, commentId); // Call service to delete the comment
        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
            data: updatedPost,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Error deleting comment",
        });
    }
});
const deletePost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield post_service_1.PostServices.deletePostFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Post deleted successfully",
        data: null,
    });
}));
exports.PostControllers = {
    createPost,
    getAllPosts,
    getPost,
    updatePost,
    deletePost,
    updateCommentController,
    deleteCommentController,
};
