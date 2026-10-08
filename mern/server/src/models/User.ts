import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  avatar?: string;
  favorites: Types.ObjectId[];
  watchlist: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    avatar: { type: String, default: "" },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
    watchlist: [{ type: Schema.Types.ObjectId, ref: "Movie" }]
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
