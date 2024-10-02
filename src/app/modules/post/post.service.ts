import QueryBuilder from "../../builder/QueryBuilder";
import { TImageFiles } from "../../interface/image.interface";
import { PostsSearchableFields } from "./post.constant";
import { TPost } from "./post.interface";
import { Post } from "./post.model";
import {
  SearchPostByDateRangeQueryMaker,
  SearchPostByUserQueryMaker,
} from "./post.utils";

const createPostIntoDB = async (payload: TPost, images: TImageFiles) => {
  const { postImages } = images;
  console.log(postImages);
  payload.images = postImages.map((image: any) => image.path);
  console.log(postImages);
  const result = await Post.create(payload);

  return result;
};

const getAllPostsFromDB = async (query: Record<string, unknown>) => {
  query = (await SearchPostByUserQueryMaker(query)) || query;

  // Date range search
  query = (await SearchPostByDateRangeQueryMaker(query)) || query;

  const postQuery = new QueryBuilder(
    Post.find().populate("user").populate("category"),
    query
  )
    .filter()
    .search(PostsSearchableFields)
    .sort()
    .fields();

  const result = await postQuery.modelQuery;

  return result;
};

const getPostFromDB = async (postId: string) => {
  const result = await Post.findById(postId)
    .populate("user")
    .populate("category");
  return result;
};

const updatePostInDB = async (postId: string, payload: TPost) => {
  const result = await Post.findByIdAndUpdate(postId, payload, { new: true });
  // if (result) {
  //   await addDocumentToIndex(result, 'posts');
  // } else {
  //   throw new Error(`Post with ID ${postId} not found.`);
  // }
  return result;
};

const deletePostFromDB = async (postId: string) => {
  const result = await Post.findByIdAndDelete(postId);
  // const deletedPostId = result?._id;
  // if (deletedPostId) {
  //   await deleteDocumentFromIndex('posts', deletedPostId.toString());
  // }
  return result;
};

export const PostServices = {
  createPostIntoDB,
  getAllPostsFromDB,
  getPostFromDB,
  updatePostInDB,
  deletePostFromDB,
};
