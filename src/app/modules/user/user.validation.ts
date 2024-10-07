import { z } from "zod";

// Validation schema for creating a user
const createUserValidationSchema = z.object({
  name: z.string({ required_error: "Name is required" }).optional(),
  email: z.string({ required_error: "Email is required" }).email().optional(),
  password: z.string({ required_error: "Password is required" }).optional(),
  phone: z
    .string({ required_error: "Phone number is required" })

    .optional(),
  img: z.string().optional(),
  bio: z.string().optional(),
  role: z
    .enum(["admin", "user"], { required_error: "Role is required" })
    .optional(),
  address: z
    .string({ required_error: "Address is required" })
    .min(1)
    .optional(),
  isDeleted: z.boolean().default(false).optional(),
  verified: z.boolean().default(false).optional(),
});

// Validation schema for login
const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email(),
    password: z.string({ required_error: "Password is required" }),
  }),
});

// Validation schema for refreshing token
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: "Refresh token is required!" }),
  }),
});

// Validation schema for updating user role
const updateUserRoleValidationSchema = z.object({
  body: z.object({
    role: z.enum(["user", "admin"], { required_error: "Role is required" }),
  }),
});

// Validation schema for updating user information
const updateUserValidationSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  phone: z.string().min(10).optional(),
  img: z.string().optional(),
  role: z.enum(["admin", "user"]).optional(),
  address: z.string().min(1).optional(),
  isDeleted: z.boolean().optional(),
});

// Exporting all validation schemas
export const userValidation = {
  createUserValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
  updateUserRoleValidationSchema,
  updateUserValidationSchema,
};
