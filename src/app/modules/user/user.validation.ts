import { z } from "zod";

const createUserValidationSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  phone: z.string().min(10).optional(),
  img: z.string().optional(),
  role: z.enum(["admin", "user"]).optional(),
  address: z.string().min(1).optional(),
  isDeleted: z.boolean().optional(),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh token is required!",
    }),
  }),
});

export const updateUserRoleValidationSchema = z.object({
  body: z
    .object({
      role: z.enum(["user", "admin"], {
        required_error: "Role is required",
      }),
    })
    .optional(),
});
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

export const userValidation = {
  createUserValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
  updateUserRoleValidationSchema,
  updateUserValidationSchema,
};
