import { Schema, model } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Partial<TUser>;

  // Hash the password if it's being updated and exists in the update data
  if (update.password) {
    update.password = await bcrypt.hash(
      update.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  next();
});

// Static method to check if user exists and retrieve password
userSchema.statics.isUserExists = async function (email: string) {
  return await this.findOne({ email }).select("+password");
};

// Static method to compare plain text password with hashed password
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>("User", userSchema);
