import { ObjectId } from "mongoose";

export interface IComment {
  comment: string;
  commenter: ObjectId;
}
export interface TPost {
  _id: ObjectId;
  title: string;
  content: string;
  images?: string[];
  category: string;
  user: ObjectId;
  //   category: ObjectId;
  upvote?: number;
  downvote?: number;
  premium?: boolean;
  comments?: IComment[];
  createdAt?: Date;
  updatedAt?: Date;
}
