import mongoose, { Schema, Document } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import { hash, compare } from "bcrypt"; // Assuming you are using bcrypt for password hashing

const UserSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    img: { type: String, required: false },
    bio: { type: String, required: false },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    address: { type: String, required: true },
    followers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }, // Initialize as empty array
    ],
    followings: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }, // Initialize as empty array
    ],
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

// Static methods for user model
UserSchema.statics.isUserExists = async function (
  email: string
): Promise<TUser | null> {
  return await this.findOne({ email });
};

UserSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await compare(plainTextPassword, hashedPassword);
};

// Middleware to hash the password before saving the user
UserSchema.pre("save", async function (this: TUser & Document, next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10); // Hashing with a salt of 10 rounds
  }
  next();
});

// Create the user model
const User = mongoose.model<TUser, UserModel>("User", UserSchema);

export { User };
