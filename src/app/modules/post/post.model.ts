import { Schema, model } from "mongoose";
import { IComment, TPost } from "./post.interface";

const commentSchema = new Schema<IComment>({
  comment: {
    type: String,
    required: true,
  },
  commenter: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const postSchema = new Schema<TPost>(
  {
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
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

export const Post = model<TPost>("Post", postSchema);
