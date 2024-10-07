import { Model, ObjectId } from "mongoose";
import { USER_ROLE } from "./user.constant";

export type TFollowers = {
  _id: ObjectId;
  follower: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface TUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  img: string;
  role: "admin" | "user";
  address: string;
  bio?: string;
  followers: TFollowers[];
  followings: TFollowers[];
  refreshToken: number;
  verified: boolean;
}

//
export type TLoginUser = {
  email: string;
  password: string;
};

export interface UserModel extends Model<TUser> {
  isUserExists(email: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
