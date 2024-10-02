import { Schema, model } from "mongoose";
import { TPost } from "./post.interface";

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
      ref: "User",
      required: true,
    },
    premium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Middleware to increment post count in associated category
// postSchema.post('save', async function (doc) {
//   try {
//     await PostCategory.findByIdAndUpdate(doc.category, {
//       $inc: { postCount: 1 },
//     });
//   } catch (error) {
//     throw new Error(
//       `Failed to increment post count for category ${doc.category}: ${error}`
//     );
//   }
// });

export const Post = model<TPost>("Post", postSchema);
