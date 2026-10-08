import mongoose, { Schema, Document } from "mongoose";

export interface IMovie extends Document {
  title: string;
  year: number;
  genre: string[];
  language: string;
  runtime: number;
  description: string;
  poster: string;
  backdrop?: string;
  trailerUrl?: string;
  director?: string;
  cast?: string[];
  ratings: {
    imdb: number;
    audience: number;
    critic: number;
  };
  userRatingAverage: number;
  userRatingCount: number;
  featured: boolean;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const movieSchema = new Schema<IMovie>(
  {
    title: { type: String, required: true, trim: true, index: true },
    year: { type: Number, required: true, index: true },
    genre: { type: [String], required: true, index: true },
    language: { type: String, default: "Tamil", index: true },
    runtime: { type: Number, default: 120 },
    description: { type: String, required: true, trim: true },
    poster: { type: String, required: true },
    backdrop: { type: String, default: "" },
    trailerUrl: { type: String, default: "" },
    director: { type: String, default: "", index: true },
    cast: { type: [String], default: [], index: true },
    ratings: {
      imdb: { type: Number, default: 7.5 },
      audience: { type: Number, default: 80 },
      critic: { type: Number, default: 75 }
    },
    userRatingAverage: { type: Number, default: 0, index: true },
    userRatingCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    viewsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

movieSchema.index({
  title: "text",
  description: "text",
  director: "text",
  cast: "text"
});

export const Movie = mongoose.model<IMovie>("Movie", movieSchema);
