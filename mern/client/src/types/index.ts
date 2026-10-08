export interface Movie {
  _id: string;
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
  score: number;
  userRatingAverage?: number;
  userRatingCount?: number;
  featured?: boolean;
  viewsCount?: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  movie: string | Movie;
  user: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewStats {
  total: number;
  average: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface HomeSections {
  featured: Movie | null;
  trending: Movie[];
  popular: Movie[];
  topRated: Movie[];
  recentlyAdded: Movie[];
  recommended: Movie[];
}

export interface AdminStats {
  totalUsers: number;
  totalMovies: number;
  totalReviews: number;
  totalFavorites: number;
  totalWatchlist: number;
}
