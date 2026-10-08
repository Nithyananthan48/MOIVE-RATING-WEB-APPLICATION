# Movie Da – MERN Stack Movie Platform

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-FF4088)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A modern, full-stack Movie Discovery, Aggregation & Community Rating Platform celebrating Tamil cinema and global entertainment. Engineered with responsive glassmorphism UI, real-time reviews, personalized recommendations, YouTube trailers, and administrative control.

---

## 📌 Project Overview

**Movie Da** is a production-ready, full-stack entertainment platform designed to elevate how cinema enthusiasts explore, evaluate, and rate movies. Focusing on curated Tamil cinema masterpieces alongside global titles, the platform bridges the gap between static movie catalogs and interactive community engagement.

Users can browse dynamically categorized collections (Trending, Top Rated, Blockbusters, Recently Released), filter across multi-attribute criteria (genres, language, year, min rating), watch official YouTube trailers, maintain personal **Favorites** and **Watchlists**, and contribute verified **1–5 star reviews** with weighted aggregate scoring.

For administrators, a secured dashboard provides catalog CRUD operations, review moderation, and platform metrics tracking.

---

## ✨ Features

### 🎬 Discovery & Browsing
- **Immersive Spotlight Hero**: Dynamic featured movie banner with backdrop imagery, rating badges, synopsis, and instant trailer preview.
- **Curated Home Sections**: Organized collections for *Trending*, *Top Rated Masterpieces*, *Fan Favorites & Blockbusters*, and *Recently Added*.
- **Personalized Recommendations**: Smart content-based algorithm recommending movies aligned with the user's favorite genres and watch history.
- **YouTube Trailer Integration**: Responsive modal dialog embedding official trailers with automatic video ID parsing.

### 🔍 Advanced Search, Filter & Sort
- **Multi-Attribute Search**: Real-time debounced search indexing movie titles, directors, cast members, and descriptions.
- **Precision Filters**: Filter by genre, language, release year, and minimum aggregate score slider.
- **Multiple Sort Criteria**: Latest releases, Top Score, Most Popular, Newest/Oldest Year, and A-Z / Z-A alphabetical ordering.
- **View Switching**: Toggle effortlessly between responsive Movie Card Grid and detailed List View.

### ⭐ Community Rating & Reviews
- **1–5 Star Rating System**: Interactive rating selector with descriptive feedback labels.
- **Weighted Aggregate Scoring**: Proprietary score combining IMDb, Critic, Audience ratings, and verified community user reviews.
- **Rating Distribution Breakdown**: Visual bar distribution displaying percentage breakdown of 5★ to 1★ ratings.
- **Anti-Spam Constraints**: Unique compound database index (`movie + user`) ensuring one review per user per movie, with update and delete permissions.

### 👤 User Personalization & Lists
- **One-Click Favorites**: Instant optimistic UI toggle for bookmarking favorite films.
- **Watchlist Queue**: Save upcoming movie watch plans with live status indicators.
- **Interactive User Profile**: Tracks total saved favorites, queued watchlists, reviews written, and average rating given.
- **Account Management**: Update display name and securely change account password.

### 🛡️ Administrative Dashboard
- **Platform Analytics**: Real-time counter metrics for Total Users, Movies, Reviews, and Favorites.
- **Full Movie CRUD**: Add, edit, or delete movies with backdrop image URLs, cast, trailers, and score overrides.
- **Review Moderation**: Inspect and remove inappropriate reviews across the entire platform.
- **Confirmation Guards**: Modal dialogs preventing accidental deletions.

### 🎨 Modern UI / UX
- **Theme Switching**: Dark Mode by default with seamless Light Mode toggle persisted in `localStorage`.
- **Responsive Layout**: Designed mobile-first, adapting smoothly to phones, tablets, laptops, and ultra-wide screens.
- **Polished Feedback**: Shimmer skeleton loading cards, toast alerts, and descriptive empty states with CTA buttons.

---

## 🛠️ Technology Stack

```
                          ┌───────────────────────────┐
                          │   React 18 + TypeScript   │
                          │   Vite + Lucide Icons     │
                          │   Dark / Light Themes     │
                          └─────────────┬─────────────┘
                                        │ HTTP / JSON REST
                                        ▼
                          ┌───────────────────────────┐
                          │    Express.js + Node 20   │
                          │    JWT Auth + Bcrypt      │
                          │    Modular MVC Route APIs │
                          └─────────────┬─────────────┘
                                        │ Mongoose ODM
                                        ▼
                          ┌───────────────────────────┐
                          │     MongoDB / Mongoose    │
                          │  (Atlas / In-Memory Dev)  │
                          └───────────────────────────┘
```

### Frontend
- **Framework**: React 18 with TypeScript
- **Tooling**: Vite 5
- **Icons**: Lucide React
- **Styling**: Vanilla CSS3 Variables, Glassmorphism backdrop blur, CSS Grid & Flexbox
- **State Management**: React Context (`AuthContext`, `ThemeContext`, `ToastContext`)

### Backend
- **Runtime**: Node.js 20+
- **Server Framework**: Express.js 4 (ES Modules)
- **Language**: TypeScript with `tsx` hot-reloading
- **Database ODM**: Mongoose 8
- **In-Memory Database**: `mongodb-memory-server` (Zero-config instant development fallback)
- **Security**: JSON Web Tokens (`jsonwebtoken`), Bcrypt password hashing (`bcryptjs`), CORS

---

## 🏗️ Project Architecture & Directory Structure

```
movie-da-mern/
├── mern/
│   ├── client/                      # Frontend Application (React + Vite)
│   │   ├── src/
│   │   │   ├── components/          # Reusable UI Components
│   │   │   │   ├── ConfirmModal.tsx # Delete confirmation dialog
│   │   │   │   ├── EmptyState.tsx   # Zero-result & empty list state
│   │   │   │   ├── FilterBar.tsx    # Search, filter pills & sort controls
│   │   │   │   ├── Footer.tsx       # Brand footer & developer info
│   │   │   │   ├── HeroBanner.tsx   # Spotlight hero banner with backdrop
│   │   │   │   ├── MovieCard.tsx    # Interactive movie card (grid/list)
│   │   │   │   ├── MovieSection.tsx # Horizontal scrolling movie carousel
│   │   │   │   ├── Navbar.tsx       # Sticky navbar, search, badges, theme
│   │   │   │   ├── ReviewList.tsx   # Community reviews & rating breakdown
│   │   │   │   ├── ReviewModal.tsx  # Interactive 5-star review modal
│   │   │   │   ├── SkeletonCard.tsx # Shimmer loading placeholder
│   │   │   │   └── TrailerModal.tsx # YouTube trailer embed dialog
│   │   │   ├── context/             # Global Context Providers
│   │   │   │   ├── AuthContext.tsx  # User state, JWT, favorites/watchlist
│   │   │   │   ├── ThemeContext.tsx # Dark/Light theme switching
│   │   │   │   └── ToastContext.tsx # Toast alerts and notifications
│   │   │   ├── pages/               # Application Pages
│   │   │   │   ├── AdminDashboardPage.tsx # Analytics & catalog CRUD
│   │   │   │   ├── FavoritesPage.tsx      # User's saved favorites
│   │   │   │   ├── HomePage.tsx           # Home with featured & sections
│   │   │   │   ├── LoginPage.tsx          # Login with demo shortcuts
│   │   │   │   ├── MovieDetailPage.tsx    # Full details, trailer, reviews
│   │   │   │   ├── MoviesPage.tsx         # Catalog search & discovery
│   │   │   │   ├── ProfilePage.tsx        # Profile stats & user lists
│   │   │   │   ├── RegisterPage.tsx       # Account registration
│   │   │   │   └── WatchlistPage.tsx      # User's queued watchlist
│   │   │   ├── services/
│   │   │   │   └── api.ts           # Centralized typed HTTP API service
│   │   │   ├── types/
│   │   │   │   └── index.ts         # TypeScript interfaces & models
│   │   │   ├── App.tsx              # Router & view controller
│   │   │   ├── main.tsx             # DOM entry point
│   │   │   └── styles.css           # Global stylesheet & design tokens
│   │   ├── .env.example             # Frontend environment template
│   │   ├── package.json             # Frontend dependencies
│   │   └── vite.config.ts           # Vite configuration
│   │
│   ├── server/                      # Backend REST API (Node + Express + Mongo)
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   ├── db.ts            # MongoDB / MongoMemoryServer connection
│   │   │   │   └── env.ts           # Environment variables loader
│   │   │   ├── controllers/
│   │   │   │   ├── adminController.ts # Platform metrics, movie CRUD
│   │   │   │   ├── authController.ts  # Register, login, profile update
│   │   │   │   ├── movieController.ts # Search, filter, home sections
│   │   │   │   ├── reviewController.ts# Review upsert, delete, aggregates
│   │   │   │   └── userController.ts  # Favorites, watchlist, user stats
│   │   │   ├── middleware/
│   │   │   │   └── auth.ts          # JWT authentication & admin guard
│   │   │   ├── models/
│   │   │   │   ├── Movie.ts         # Movie Mongoose schema & text index
│   │   │   │   ├── Review.ts        # Review schema with unique compound index
│   │   │   │   └── User.ts          # User schema with favorites & watchlist
│   │   │   ├── routes/
│   │   │   │   ├── adminRoutes.ts   # Admin management endpoints
│   │   │   │   ├── authRoutes.ts    # Authentication endpoints
│   │   │   │   ├── movieRoutes.ts   # Movie catalog endpoints
│   │   │   │   ├── reviewRoutes.ts  # Review management endpoints
│   │   │   │   └── userRoutes.ts    # User list & profile endpoints
│   │   │   ├── services/
│   │   │   │   └── seedData.ts      # 24+ Tamil movies catalog & seed runner
│   │   │   └── index.ts             # Express server setup & router mounts
│   │   ├── .env.example             # Backend environment template
│   │   └── package.json             # Backend dependencies
│   ├── package.json                 # Monorepo workspace configuration
│   └── PROJECT_REPORT.md            # Academic project documentation
├── .gitignore                       # Git exclusion rules
├── package.json                     # Root scripts & workspaces
└── README.md                        # Project documentation
```

---

## 🗄️ Database Models

### 1. `Movie` Model
| Field | Type | Description |
|---|---|---|
| `title` | String | Movie title *(Text Indexed)* |
| `year` | Number | Release year *(Indexed)* |
| `genre` | [String] | Array of genres *(Indexed)* |
| `language` | String | Original language (default: "Tamil") |
| `runtime` | Number | Duration in minutes |
| `description` | String | Full synopsis *(Text Indexed)* |
| `poster` | String | Poster image URL |
| `backdrop` | String | High-resolution backdrop banner URL |
| `trailerUrl` | String | YouTube video / embed URL |
| `director` | String | Director name *(Text Indexed)* |
| `cast` | [String] | Lead actors array *(Text Indexed)* |
| `ratings` | Object | `{ imdb, audience, critic }` |
| `userRatingAverage` | Number | Recomputed average rating from community reviews |
| `userRatingCount` | Number | Total count of submitted reviews |
| `featured` | Boolean | Spotlight status on Home hero |
| `viewsCount` | Number | Incremented on movie detail view |

### 2. `User` Model
| Field | Type | Description |
|---|---|---|
| `name` | String | Full user display name |
| `email` | String | Unique lowercase email address *(Indexed)* |
| `passwordHash` | String | Bcrypt salted hash (never returned to client) |
| `role` | String | Role: `"user"` or `"admin"` |
| `avatar` | String | DiceBear / custom avatar URL |
| `favorites` | [ObjectId] | References to `Movie` documents |
| `watchlist` | [ObjectId] | References to `Movie` documents |

### 3. `Review` Model
| Field | Type | Description |
|---|---|---|
| `movie` | ObjectId | Reference to `Movie` *(Indexed)* |
| `user` | ObjectId | Reference to `User` *(Indexed)* |
| `userName` | String | Cached reviewer display name |
| `userAvatar` | String | Cached reviewer avatar |
| `rating` | Number | 1 to 5 integer rating |
| `comment` | String | Review description text |
| *Index* | Compound | `{ movie: 1, user: 1 }` (unique constraint) |

---

## 🌐 REST API Overview

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/auth/me` | User | Get authenticated user profile & counts |
| `PUT` | `/api/auth/profile` | User | Update display name and/or password |

### Movies (`/api/movies`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/movies` | Public | Filter, search, sort, and paginate movies |
| `GET` | `/api/movies/home-sections` | Public | Fetch featured, trending, popular & top rated |
| `GET` | `/api/movies/filters` | Public | Get distinct genres, languages, and years |
| `GET` | `/api/movies/recommendations/user` | Public/User | Content-based recommendations |
| `GET` | `/api/movies/:id` | Public | Retrieve full movie details & increment views |
| `GET` | `/api/movies/:id/similar` | Public | Get movies sharing matching genres |
| `GET` | `/api/movies/:id/reviews` | Public | Get movie reviews & rating distribution |
| `POST` | `/api/movies/:id/reviews` | User | Submit or update 1–5 star review |

### User Personalization (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users/lists` | User | Get arrays of favorite & watchlist IDs |
| `GET` | `/api/users/favorites` | User | Get populated favorite movies |
| `POST` | `/api/users/favorites/:movieId` | User | Toggle movie in favorites list |
| `GET` | `/api/users/watchlist` | User | Get populated watchlist movies |
| `POST` | `/api/users/watchlist/:movieId` | User | Toggle movie in watchlist |
| `GET` | `/api/users/profile-stats` | User | Get comprehensive profile statistics |
| `GET` | `/api/users/reviews` | User | Get all reviews written by logged-in user |

### Admin (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Admin | Platform overview analytics & counts |
| `POST` | `/api/admin/movies` | Admin | Add new movie to catalog |
| `PUT` | `/api/admin/movies/:id` | Admin | Update existing movie details |
| `DELETE` | `/api/admin/movies/:id` | Admin | Delete movie and associated reviews |
| `GET` | `/api/admin/reviews` | Admin | Review moderation stream |
| `DELETE` | `/api/admin/reviews/:id` | Admin | Moderate/delete inappropriate review |

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js**: Version 18.x or 20.x LTS installed
- **npm**: Version 9.x or higher

---

### Step 1: Clone Repository
```bash
git clone https://github.com/Nithyananthan48/movie-da-mern.git
cd movie-da-mern
```

---

### Step 2: Configure Environment Variables

**Backend (`mern/server/.env`):**
```env
PORT=5000
# Leave blank to use zero-config in-memory MongoDB, or provide MongoDB Atlas URI:
MONGO_URI=
JWT_SECRET=super-secret-movie-da-key-2025
NODE_ENV=development
```

**Frontend (`mern/client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

---

### Step 3: Start the Backend Server

```bash
cd mern/server
npm install
npm run dev
```

*The backend starts at `http://localhost:5000`. On first run, it automatically seeds 24+ Tamil cinema titles, trailers, and demo accounts.*

---

### Step 4: Start the Frontend Client

Open a second terminal window:

```bash
cd mern/client
npm install
npm run dev
```

*The frontend starts at `http://localhost:5173`.*

---

### Or Run from Project Root:
```bash
# Start backend
npm run dev:mern:server

# Start frontend (in another terminal)
npm run dev:mern:client
```

---

## 🔑 Demo Credentials for Testing

For immediate testing, use the built-in demo credentials (or click the one-click demo login buttons on the Sign In page):

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Demo User** | `demo@movieda.com` | `demo1234` | Full user access (Favorites, Watchlist, Reviews) |
| **Admin Officer** | `admin@moviehub.com` | `admin123` | Full Administrator privileges (CRUD & Moderation) |

---

## 🔮 Future Enhancements

- [ ] **Social Features**: Follow other cinephiles, view public movie lists, and comment on reviews.
- [ ] **SDR & Streaming Integrations**: Link direct watch providers (Netflix, Prime, Hotstar, Aha).
- [ ] **Custom Lists**: Allow users to create custom playlists (e.g., *"Top 10 Thalaivar Moments"*, *"Best Screenplays"*).
- [ ] **AI-Powered Semantic Search**: Natural language search (e.g., *"movies with mind-bending plot twists set in Chennai"*).

---

## 👨‍💻 Developer & Author

**Nithyananthan N**  
*MCA Student | Full Stack Web Developer*  

- **GitHub**: [https://github.com/Nithyananthan48](https://github.com/Nithyananthan48)
- **LinkedIn**: [https://www.linkedin.com/in/nithyananthan959794/](https://www.linkedin.com/in/nithyananthan959794/)
- **Repository**: [https://github.com/Nithyananthan48/movie-da-mern](https://github.com/Nithyananthan48/movie-da-mern)

---

## 📄 License

Distributed under the MIT License. Developed for portfolio demonstration and educational purposes.
