import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import AppError from "../../error/AppError";
import catchAsync from "../../utils/catchAsync";
import config from "../../config";
import { TUserRole } from "../user/user.interface";

// Auth Middleware
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return next(
        new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!")
      );
    }

    const token = authorizationHeader.split(" ")[1]; // Extract the token

    // Verify the JWT Token
    jwt.verify(token, config.jwt_access_secret as string, (err, decoded) => {
      if (err || !decoded) {
        return next(
          new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token!")
        );
      }

      const user = decoded as JwtPayload;

      // Role-based access control (RBAC)
      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        return res.status(httpStatus.FORBIDDEN).json({
          success: false,
          statusCode: httpStatus.FORBIDDEN,
          message: "You do not have access to this route.",
        });
      }

      req.user = user; // Attach decoded user info to the request object
      next();
    });
  });
};

export default auth;
