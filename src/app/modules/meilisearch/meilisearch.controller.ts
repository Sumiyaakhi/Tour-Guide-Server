import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { MeilisearchServices } from "./meilisearch.services";
import catchAsync from "../../utils/catchAsync";

const getPostsFromMeili = catchAsync(async (req: Request, res: Response) => {
  const { searchTerm, limit } = req.query;

  const numberLimit = Number(limit) || 10;

  const result = await MeilisearchServices.getAllPosts(
    // Updated 'getAllItems' to 'getAllPosts'
    numberLimit,
    searchTerm as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Posts Retrieved Successfully", // Changed 'Items' to 'Posts'
    data: result,
  });
});

export const MeiliSearchController = {
  getPostsFromMeili, // Updated function name
};
