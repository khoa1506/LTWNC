const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Movie = require("./models/Movie");
const User = require("./models/User");
require("dotenv").config();

const seedMovies = async () => {
  await connectDB();
  try {
    const user = await User.findOne({ email: "test@example.com" });
    if (!user) {
      console.log("User not found. Please create a user first.");
      process.exit(1);
    }
    await Movie.deleteMany({ userId: user._id });
    const sampleMovies = [
      {
        tmdbId: "299534",
        title: "Avengers: Endgame",
        posterPath: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        userId: user._id,
      },
      // ... other movies ...
    ];
    await Movie.insertMany(sampleMovies);
    console.log("Sample movies added successfully!");
    await User.findByIdAndUpdate(user._id, {
      favorites: sampleMovies.map((movie) => movie._id),
    });
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
seedMovies();