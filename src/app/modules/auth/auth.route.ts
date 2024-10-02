import express from "express";
import {
  changePassword,
  forgotPassword,
  resetPassword,
} from "./auth.controller";

const router = express.Router();

// Password recovery and reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Change password route (protected)
router.post("/change-password", changePassword);

export const AuthRouter = router;
