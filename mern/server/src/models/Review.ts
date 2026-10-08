import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReview extends Document {
  movie: Types.ObjectId;
  user: Types.ObjectId;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    userName: { type: String, required: true, trim: true },
    userAvatar: { type: String, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

// One review per user per movie
reviewSchema.index({ movie: 1, user: 1 }, { unique: true });

export const Review = mongoose.model<IReview>("Review", reviewSchema);
