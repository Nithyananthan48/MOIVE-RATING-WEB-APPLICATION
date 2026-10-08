import bcrypt from "bcryptjs";
import { Movie } from "../models/Movie.js";
import { User } from "../models/User.js";
import { Review } from "../models/Review.js";

interface MovieSeed {
  title: string;
  year: number;
  genre: string[];
  language: string;
  runtime: number;
  director: string;
  cast: string[];
  description: string;
  poster: string;
  backdrop: string;
  trailerUrl: string;
  featured?: boolean;
  ratings: {
    imdb: number;
    audience: number;
    critic: number;
  };
}

export const TAMIL_MOVIES_CATALOG: MovieSeed[] = [
  {
    title: "Baasha",
    year: 1995,
    genre: ["Action", "Crime", "Drama"],
    language: "Tamil",
    runtime: 145,
    director: "Suresh Krissna",
    cast: ["Rajinikanth", "Nagma", "Raghuvaran", "Janagaraj"],
    description: "An unassuming auto driver hides a dark underworld past in Mumbai as an iconic crime lord known as Manik Baasha, stepping up once again when his family's safety is compromised.",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/fW_5r1y4P0Y",
    featured: true,
    ratings: { imdb: 8.4, audience: 94, critic: 85 }
  },
  {
    title: "Nayakan",
    year: 1987,
    genre: ["Crime", "Drama"],
    language: "Tamil",
    runtime: 156,
    director: "Mani Ratnam",
    cast: ["Kamal Haasan", "Saranya Ponvannan", "Janagaraj", "Delhi Ganesh"],
    description: "Mani Ratnam's acclaimed cinematic masterpiece tracing the rise of Velu Naicker, an orphaned slum dweller who rises to become a revered underworld godfather protecting Mumbai's Tamil migrant community.",
    poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/6Yk21c_e0uI",
    featured: true,
    ratings: { imdb: 8.6, audience: 95, critic: 92 }
  },
  {
    title: "Thalapathi",
    year: 1991,
    genre: ["Drama", "Action"],
    language: "Tamil",
    runtime: 157,
    director: "Mani Ratnam",
    cast: ["Rajinikanth", "Mammootty", "Arvind Swamy", "Shobana"],
    description: "A gritty adaptation of the Mahabharata's Karna-Duryodhana friendship, where an abandoned orphan finds brotherhood with a local don while confronting his own estranged family.",
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/g2f0wA4b_5U",
    ratings: { imdb: 8.5, audience: 93, critic: 88 }
  },
  {
    title: "Vikram",
    year: 2022,
    genre: ["Action", "Thriller", "Crime"],
    language: "Tamil",
    runtime: 175,
    director: "Lokesh Kanagaraj",
    cast: ["Kamal Haasan", "Vijay Sethupathi", "Fahadh Faasil", "Suriya"],
    description: "A high-octane black-ops thriller in the Lokesh Cinematic Universe (LCU) following a special investigator tracking down masked vigilantes, uncovering a shadowy conspiracy led by drug cartel boss Sandhanam.",
    poster: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/OKBMCLzuvTW",
    featured: true,
    ratings: { imdb: 8.3, audience: 92, critic: 86 }
  },
  {
    title: "Kaithi",
    year: 2019,
    genre: ["Action", "Thriller"],
    language: "Tamil",
    runtime: 145,
    director: "Lokesh Kanagaraj",
    cast: ["Karthi", "Narain", "Dheena", "Arjun Das"],
    description: "A recently released prisoner seeking to meet his young daughter for the first time is compelled to drive a truck full of poisoned police officers through dangerous gangs in a single harrowing night.",
    poster: "https://images.unsplash.com/photo-1512070679279-8988d32161be?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/g6n_FwS_Jek",
    ratings: { imdb: 8.5, audience: 93, critic: 89 }
  },
  {
    title: "Jai Bhim",
    year: 2021,
    genre: ["Drama", "Legal", "Crime"],
    language: "Tamil",
    runtime: 164,
    director: "T. J. Gnanavel",
    cast: ["Suriya", "Lijomol Jose", "Manikandan", "Rajisha Vijayan"],
    description: "Based on true events, an intrepid human rights lawyer fights tenaciously for justice when an innocent tribal man is falsely accused and mysteriously disappears from police custody.",
    poster: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1453738773917-9c3eff1db985?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/Gc6dEDnL8JA",
    ratings: { imdb: 8.8, audience: 96, critic: 93 }
  },
  {
    title: "96",
    year: 2018,
    genre: ["Romance", "Drama"],
    language: "Tamil",
    runtime: 158,
    director: "C. Prem Kumar",
    cast: ["Vijay Sethupathi", "Trisha Krishnan", "Gouri Kishan", "Aadukalam Murugadoss"],
    description: "Two high school sweethearts from the batch of 1996 reunite at their school reunion after two decades of separation, reminiscing over what was, what could have been, and their enduring silent bond.",
    poster: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/rLzOQ05f7U0",
    ratings: { imdb: 8.5, audience: 94, critic: 91 }
  },
  {
    title: "Asuran",
    year: 2019,
    genre: ["Drama", "Action"],
    language: "Tamil",
    runtime: 141,
    director: "Vetrimaaran",
    cast: ["Dhanush", "Manju Warrier", "Ken Karunas", "Prakash Raj"],
    description: "A peace-seeking farmer with a violent past is pushed to the brink when an arrogant upper-caste landlord seeks to destroy his family, forcing him to wage an unyielding battle for survival.",
    poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/vJ3r_pM_Hyo",
    ratings: { imdb: 8.4, audience: 92, critic: 88 }
  },
  {
    title: "Pariyerum Perumal",
    year: 2018,
    genre: ["Drama"],
    language: "Tamil",
    runtime: 154,
    director: "Mari Selvaraj",
    cast: ["Kathir", "Anandhi", "Yogi Babu", "G. Marimuthu"],
    description: "An idealistic young law student from an oppressed caste struggles with systemic prejudice, discrimination, and violent oppression while forming an unlikely friendship with a classmate.",
    poster: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/g2J65tI0Vrk",
    ratings: { imdb: 8.6, audience: 94, critic: 92 }
  },
  {
    title: "Super Deluxe",
    year: 2019,
    genre: ["Drama", "Thriller", "Comedy"],
    language: "Tamil",
    runtime: 176,
    director: "Thiagarajan Kumararaja",
    cast: ["Vijay Sethupathi", "Fahadh Faasil", "Samantha Ruth Prabhu", "Ramya Krishnan"],
    description: "An idiosyncratic hyperlink narrative weaving four parallel stories in Chennai: a transgender woman reuniting with her son, a stray corpse, teenagers seeking an adult video, and a corrupt cop.",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/3-Xq_ZCXdOU",
    ratings: { imdb: 8.3, audience: 91, critic: 88 }
  },
  {
    title: "Maanagaram",
    year: 2017,
    genre: ["Thriller", "Action"],
    language: "Tamil",
    runtime: 137,
    director: "Lokesh Kanagaraj",
    cast: ["Sundeep Kishan", "Sri", "Regina Cassandra", "Charle"],
    description: "Four strangers in the bustling, unforgiving metropolis of Chennai find their lives unpredictably entangled through a series of misunderstandings, mistaken identities, and mob kidnappings.",
    poster: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/d3-Y5J19tP8",
    ratings: { imdb: 8.1, audience: 89, critic: 85 }
  },
  {
    title: "Master",
    year: 2021,
    genre: ["Action", "Thriller"],
    language: "Tamil",
    runtime: 179,
    director: "Lokesh Kanagaraj",
    cast: ["Thalapathy Vijay", "Vijay Sethupathi", "Malavika Mohanan", "Arjun Das"],
    description: "An alcoholic college professor is dispatched to a juvenile correction home, where he crosses paths and locks horns with a ruthless gangster who exploits delinquent youths for criminal enterprises.",
    poster: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/UTiXQgkFeG8",
    ratings: { imdb: 7.9, audience: 87, critic: 79 }
  },
  {
    title: "Leo",
    year: 2023,
    genre: ["Action", "Thriller"],
    language: "Tamil",
    runtime: 164,
    director: "Lokesh Kanagaraj",
    cast: ["Thalapathy Vijay", "Sanjay Dutt", "Arjun Sarja", "Trisha Krishnan"],
    description: "A tranquil cafe owner living in Himachal Pradesh becomes an overnight hero after thwarting an armed robbery, which ignites unwanted attention from ruthless gangsters who believe he is their past enforcer Leo Das.",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/Po3jStA673E",
    featured: true,
    ratings: { imdb: 7.8, audience: 88, critic: 81 }
  },
  {
    title: "Jailer",
    year: 2023,
    genre: ["Action", "Comedy", "Crime"],
    language: "Tamil",
    runtime: 168,
    director: "Nelson Dilipkumar",
    cast: ["Rajinikanth", "Vinayakan", "Ramya Krishnan", "Vasanth Ravi", "Mohanlal", "Shiva Rajkumar"],
    description: "A retired prison warden living a quiet life with his family goes on a relentless rampage to uncover the truth and dismantle an idol smuggling syndicate after his police officer son goes missing.",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/xenOE1Tma0A",
    ratings: { imdb: 7.9, audience: 89, critic: 82 }
  },
  {
    title: "Maharaja",
    year: 2024,
    genre: ["Thriller", "Action", "Drama"],
    language: "Tamil",
    runtime: 140,
    director: "Nithilan Saminathan",
    cast: ["Vijay Sethupathi", "Anurag Kashyap", "Mamta Mohandas", "Natty Subramaniam"],
    description: "A humble barber approaches the police station with an eccentric complaint about his stolen metal dustbin named Lakshmi, masking an ingenious and harrowing quest for vengeance against brutal predators.",
    poster: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/14d0Y0k3Q7g",
    featured: true,
    ratings: { imdb: 8.5, audience: 94, critic: 89 }
  },
  {
    title: "Ponniyin Selvan: Part 1",
    year: 2022,
    genre: ["Historical", "Action", "Drama"],
    language: "Tamil",
    runtime: 167,
    director: "Mani Ratnam",
    cast: ["Vikram", "Aishwarya Rai Bachchan", "Jayam Ravi", "Karthi", "Trisha Krishnan"],
    description: "Vandiyathevan sets out across South India to deliver a message from Crown Prince Aditha Karikalan, getting entangled in court conspiracies threatening the mighty Chola Empire.",
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/D4qAQYlgZVM",
    ratings: { imdb: 7.6, audience: 85, critic: 83 }
  },
  {
    title: "Alaipayuthey",
    year: 2000,
    genre: ["Romance", "Drama"],
    language: "Tamil",
    runtime: 156,
    director: "Mani Ratnam",
    cast: ["R. Madhavan", "Shalini", "Jayamalini", "Arvind Swamy"],
    description: "A passionate exploration of modern love, elopement, and the real-world trials of early marriage between two ambitious youngsters from differing socioeconomic backgrounds in Chennai.",
    poster: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/uD3n-Ea8W_g",
    ratings: { imdb: 8.3, audience: 92, critic: 86 }
  },
  {
    title: "Ghajini",
    year: 2005,
    genre: ["Thriller", "Action"],
    language: "Tamil",
    runtime: 183,
    director: "A. R. Murugadoss",
    cast: ["Suriya", "Asin", "Nayanthara", "Pradeep Rawat"],
    description: "A wealthy telecom tycoon suffering from anterograde amnesia uses tattoos, Polaroid photographs, and systematic notes to avenge the murder of his beloved sweetheart.",
    poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/hB2hH_aG5H8",
    ratings: { imdb: 8.4, audience: 92, critic: 86 }
  },
  {
    title: "Vaaranam Aayiram",
    year: 2008,
    genre: ["Drama", "Romance"],
    language: "Tamil",
    runtime: 169,
    director: "Gautham Vasudev Menon",
    cast: ["Suriya", "Simran", "Sameera Reddy", "Divya Spandana"],
    description: "A heartfelt coming-of-age chronicle illustrating a son's profound admiration for his father, navigating tragic heartbreak, military service, and emotional redemption.",
    poster: "https://images.unsplash.com/photo-1512070679279-8988d32161be?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/U3H6kX8pG0E",
    ratings: { imdb: 8.2, audience: 90, critic: 82 }
  },
  {
    title: "Aadukalam",
    year: 2011,
    genre: ["Drama", "Sport"],
    language: "Tamil",
    runtime: 160,
    director: "Vetrimaaran",
    cast: ["Dhanush", "Taapsee Pannu", "V. I. S. Jayapalan", "Kishore"],
    description: "In the rooster-fighting arenas of Madurai, an ambitious young apprentice wins against his master's rooster, unleashing dark jealousy, betrayal, and deadly rivalries.",
    poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/kK_R2E_xWQE",
    ratings: { imdb: 8.0, audience: 88, critic: 84 }
  },
  {
    title: "Soodhu Kavvum",
    year: 2013,
    genre: ["Comedy", "Crime"],
    language: "Tamil",
    runtime: 135,
    director: "Nalan Kumarasamy",
    cast: ["Vijay Sethupathi", "Bobby Simha", "Ashok Selvan", "Sanchita Shetty"],
    description: "A quirky middle-aged kidnapper with an imaginary girlfriend leads an eccentric gang of inept recruits on a low-risk kidnapping that spirals into hilarious political chaos.",
    poster: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/0Q3P3kP9g0M",
    ratings: { imdb: 8.2, audience: 90, critic: 85 }
  },
  {
    title: "Pizza",
    year: 2012,
    genre: ["Thriller", "Horror"],
    language: "Tamil",
    runtime: 127,
    director: "Karthik Subbaraj",
    cast: ["Vijay Sethupathi", "Remya Nambeesan", "Aadukalam Naren", "Pooja Ramachandran"],
    description: "A pizza delivery boy finds himself trapped inside a spooky mansion during a routine delivery, where mysterious occurrences and apparitions turn his life upside down.",
    poster: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/d3-Y5J19tP8",
    ratings: { imdb: 8.0, audience: 87, critic: 82 }
  },
  {
    title: "Jigarthanda",
    year: 2014,
    genre: ["Crime", "Comedy", "Drama"],
    language: "Tamil",
    runtime: 171,
    director: "Karthik Subbaraj",
    cast: ["Siddharth", "Bobby Simha", "Lakshmi Menon", "Karunakaran"],
    description: "An aspiring filmmaker goes undercover in Madurai to shadow a notorious, ruthless gangster for a crime film, leading to unexpected comedic entanglements and meta-cinema brilliance.",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/s3n-Ea8W_g",
    ratings: { imdb: 8.3, audience: 91, critic: 86 }
  },
  {
    title: "Sivaji: The Boss",
    year: 2007,
    genre: ["Action", "Drama"],
    language: "Tamil",
    runtime: 188,
    director: "S. Shankar",
    cast: ["Rajinikanth", "Shriya Saran", "Suman", "Vivek"],
    description: "A prosperous software engineer returns from the US to offer free education and healthcare to Tamil Nadu, taking on corrupt politicians and black money kingpins.",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    trailerUrl: "https://www.youtube.com/embed/xenOE1Tma0A",
    ratings: { imdb: 7.6, audience: 85, critic: 75 }
  }
];

export async function seedDatabaseIfEmpty() {
  const count = await Movie.countDocuments();
  if (count === 0) {
    console.log("Seeding Tamil movie catalog into database...");
    await Movie.insertMany(TAMIL_MOVIES_CATALOG);
    console.log(`Seeded ${TAMIL_MOVIES_CATALOG.length} movies.`);
  } else {
    // Ensure all movies have trailerUrl and backdrop if missing
    for (const item of TAMIL_MOVIES_CATALOG) {
      await Movie.updateOne(
        { title: item.title, trailerUrl: { $in: ["", null] } },
        {
          $set: {
            trailerUrl: item.trailerUrl,
            backdrop: item.backdrop,
            director: item.director,
            cast: item.cast
          }
        }
      );
    }
  }

  // Create Admin User if not present
  const adminEmail = "admin@moviehub.com";
  const existingAdmin = await User.findOne({ email: adminEmail });
  let adminUser: any = existingAdmin;
  if (!existingAdmin) {
    console.log("Creating default Admin user (admin@moviehub.com / admin123)...");
    adminUser = await User.create({
      name: "Admin Officer",
      email: adminEmail,
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "admin",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=AdminOfficer",
      favorites: [],
      watchlist: []
    });
  }

  // Create Demo User if not present
  const demoEmail = "demo@movieda.com";
  const existingDemo = await User.findOne({ email: demoEmail });
  let demoUser: any = existingDemo;
  if (!existingDemo) {
    console.log("Creating default Demo user (demo@movieda.com / demo1234)...");
    demoUser = await User.create({
      name: "Ananthan",
      email: demoEmail,
      passwordHash: await bcrypt.hash("demo1234", 10),
      role: "user",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Ananthan",
      favorites: [],
      watchlist: []
    });
  }

  // Seed sample initial reviews if none exist
  const reviewCount = await Review.countDocuments();
  if (reviewCount === 0 && demoUser) {
    console.log("Seeding sample user reviews...");
    const sampleMovies = await Movie.find().limit(5);
    const reviewsToSeed = [
      {
        movie: sampleMovies[0]._id,
        user: demoUser._id,
        userName: demoUser.name,
        userAvatar: demoUser.avatar,
        rating: 5,
        comment: "Absolute all-time classic! The music, hero elevation scenes, and screenplay are timeless masterpiece standards in Tamil cinema."
      },
      {
        movie: sampleMovies[1]._id,
        user: demoUser._id,
        userName: demoUser.name,
        userAvatar: demoUser.avatar,
        rating: 5,
        comment: "Unmatched performance and direction. The visual style and raw emotional depth make this a benchmark of world cinema."
      },
      {
        movie: sampleMovies[2]._id,
        user: demoUser._id,
        userName: demoUser.name,
        userAvatar: demoUser.avatar,
        rating: 4,
        comment: "Remarkable performances and unforgettable background score by Ilaiyaraaja. A cinematic treat."
      }
    ];

    for (const r of reviewsToSeed) {
      await Review.create(r);
      // update movie user rating
      await Movie.findByIdAndUpdate(r.movie, {
        userRatingAverage: r.rating,
        userRatingCount: 1
      });
    }
  }

  console.log("Seed verification complete.");
}
