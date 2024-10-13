"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
// Define the validation schema for creating a post
const createPostValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "Title is required",
        }),
        content: zod_1.z.string({
            required_error: "Content is required",
        }),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        category: zod_1.z.string({
            required_error: "Category is required",
        }),
        user: zod_1.z
            .string({
            required_error: "User is required",
        })
            .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
            message: "Invalid user ID",
        }),
        premium: zod_1.z.boolean().optional(),
        createdAt: zod_1.z.date().optional(),
        updatedAt: zod_1.z.date().optional(),
        // Validation for upvote and downvote
        upvote: zod_1.z
            .number({
            required_error: "Upvote is required",
        })
            .min(0, { message: "Upvote cannot be less than 0" })
            .int({ message: "Upvote must be an integer" })
            .optional(),
        downvote: zod_1.z
            .number({
            required_error: "Downvote is required",
        })
            .min(0, { message: "Downvote cannot be less than 0" })
            .int({ message: "Downvote must be an integer" })
            .optional(),
        // Validation for comments
        comments: zod_1.z
            .array(zod_1.z.object({
            comment: zod_1.z.string({
                required_error: "Comment is required",
            }),
            commenter: zod_1.z
                .string({
                required_error: "Commenter is required",
            })
                .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
                message: "Invalid commenter ID",
            }),
        }))
            .optional(),
    }),
});
// Validation schema for updating a post
const updatePostValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        content: zod_1.z.string().optional(),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        category: zod_1.z
            .string()
            .refine((val) => {
            return mongoose_1.default.Types.ObjectId.isValid(val);
        })
            .optional(),
        user: zod_1.z
            .string()
            .refine((val) => {
            return mongoose_1.default.Types.ObjectId.isValid(val);
        })
            .optional(),
        premium: zod_1.z.boolean().optional(),
        createdAt: zod_1.z.date().optional(),
        updatedAt: zod_1.z.date().optional(),
        // Validation for comments
        comment: zod_1.z
            .array(zod_1.z.object({
            comment: zod_1.z.string().optional(),
            commenter: zod_1.z
                .string()
                .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
                message: "Invalid commenter ID",
            })
                .optional(),
        }))
            .optional(),
    }),
});
exports.PostValidation = {
    createPostValidationSchema,
    updatePostValidationSchema,
};
