"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
// Validation schema for creating a user
const createUserValidationSchema = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }).optional(),
    email: zod_1.z.string({ required_error: "Email is required" }).email().optional(),
    password: zod_1.z.string({ required_error: "Password is required" }).optional(),
    phone: zod_1.z
        .string({ required_error: "Phone number is required" })
        .optional(),
    img: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    role: zod_1.z
        .enum(["admin", "user"], { required_error: "Role is required" })
        .optional(),
    address: zod_1.z
        .string({ required_error: "Address is required" })
        .min(1)
        .optional(),
    isDeleted: zod_1.z.boolean().default(false).optional(),
    verified: zod_1.z.boolean().default(false).optional(),
});
// Validation schema for login
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "Email is required" }).email(),
        password: zod_1.z.string({ required_error: "Password is required" }),
    }),
});
// Validation schema for refreshing token
const refreshTokenValidationSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({ required_error: "Refresh token is required!" }),
    }),
});
// Validation schema for updating user role
const updateUserRoleValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z.enum(["user", "admin"], { required_error: "Role is required" }),
    }),
});
// Validation schema for updating user information
const updateUserValidationSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(8).optional(),
    phone: zod_1.z.string().min(10).optional(),
    img: zod_1.z.string().optional(),
    role: zod_1.z.enum(["admin", "user"]).optional(),
    address: zod_1.z.string().min(1).optional(),
    isDeleted: zod_1.z.boolean().optional(),
});
// Exporting all validation schemas
exports.userValidation = {
    createUserValidationSchema,
    loginValidationSchema,
    refreshTokenValidationSchema,
    updateUserRoleValidationSchema,
    updateUserValidationSchema,
};
