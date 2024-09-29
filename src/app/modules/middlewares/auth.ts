import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { TUserRole } from "../user/user.interface";

const auth = (...requiredRoles: TUserRole[]) => {
  // console.log(...requiredRoles);
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    // console.log("Authorization header =", authorizationHeader);
    if (!authorizationHeader) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    const token = authorizationHeader.startsWith("Bearer ")
      ? authorizationHeader.split(" ")[1]
      : null;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    // Check if the token is valid
    jwt.verify(token, config.jwt_access_secret as string, (err, decoded) => {
      if (err) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      const role = (decoded as JwtPayload).role;

      if (requiredRoles && !requiredRoles.includes(role)) {
        return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          statusCode: httpStatus.UNAUTHORIZED,
          message: "You have no access to this route",
        });
      }

      req.user = decoded as JwtPayload;
      next();
    });
  });
};

export default auth;
