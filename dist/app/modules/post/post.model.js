"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    comment: {
        type: String,
        required: true,
    },
    commenter: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});
const postSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        default: [],
    },
    category: {
        type: String,
        required: true,
    },
    upvote: {
        type: Number,
        default: 0,
        required: true,
    },
    downvote: {
        type: Number,
        default: 0,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
    premium: {
        type: Boolean,
        default: false,
    },
    comments: {
        type: [commentSchema],
        default: [],
    },
}, {
    timestamps: true,
});
exports.Post = (0, mongoose_1.model)("Post", postSchema);
