import mongoose from "mongoose";
import { z } from "zod";

// Define the validation schema for creating a post
const createPostValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    content: z.string({
      required_error: "Content is required",
    }),
    images: z.array(z.string()).optional(),
    category: z.string({
      required_error: "Category is required",
    }),

    user: z
      .string({
        required_error: "User is required",
      })
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid user ID",
      }),

    premium: z.boolean().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),

    // Validation for upvote and downvote
    upvote: z
      .number({
        required_error: "Upvote is required",
      })
      .min(0, { message: "Upvote cannot be less than 0" })
      .int({ message: "Upvote must be an integer" })
      .optional(),
    downvote: z
      .number({
        required_error: "Downvote is required",
      })
      .min(0, { message: "Downvote cannot be less than 0" })
      .int({ message: "Downvote must be an integer" })
      .optional(),

    // Validation for comments
    comments: z
      .array(
        z.object({
          comment: z.string({
            required_error: "Comment is required",
          }),
          commenter: z
            .string({
              required_error: "Commenter is required",
            })
            .refine((val) => mongoose.Types.ObjectId.isValid(val), {
              message: "Invalid commenter ID",
            }),
        })
      )
      .optional(),
  }),
});

// Validation schema for updating a post
const updatePostValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    images: z.array(z.string()).optional(),
    category: z
      .string()
      .refine((val) => {
        return mongoose.Types.ObjectId.isValid(val);
      })
      .optional(),
    user: z
      .string()
      .refine((val) => {
        return mongoose.Types.ObjectId.isValid(val);
      })
      .optional(),
    premium: z.boolean().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),

    // Validation for comments
    comment: z
      .array(
        z.object({
          comment: z.string().optional(),
          commenter: z
            .string()
            .refine((val) => mongoose.Types.ObjectId.isValid(val), {
              message: "Invalid commenter ID",
            })
            .optional(),
        })
      )
      .optional(),
  }),
});

export const PostValidation = {
  createPostValidationSchema,
  updatePostValidationSchema,
};
