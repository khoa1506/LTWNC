const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Movie = require("../models/Movie");
const User = require("../models/User");
const axios = require("axios");
require("dotenv").config();

// Proxy TMDB popular movies
router.get("/tmdb/popular", async (req, res) => {
  try {
    const { page = 1, genreId } = req.query;
    console.log("Fetching TMDB popular, page:", page, "genreId:", genreId); // Debug
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${
      process.env.TMDB_API_KEY
    }&page=${page}${genreId ? `&with_genres=${genreId}` : ""}`;
    const response = await axios.get(url);
    console.log("TMDB popular response:", response.data.results.length, "movies");
    res.json(response.data);
  } catch (err) {
    console.error("TMDB popular error:", err.response?.data || err.message);
    res.status(500).json({ msg: "Failed to fetch TMDB data" });
  }
});

// Proxy TMDB search
router.get("/tmdb/search", async (req, res) => {
  try {
    const { query, page = 1, genreId } = req.query;
    console.log("Fetching TMDB search, query:", query, "page:", page, "genreId:", genreId);
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${
      process.env.TMDB_API_KEY
    }&query=${encodeURIComponent(query)}&page=${page}${
      genreId ? `&with_genres=${genreId}` : ""
    }`;
    const response = await axios.get(url);
    console.log("TMDB search response:", response.data.results.length, "movies");
    res.json(response.data);
  } catch (err) {
    console.error("TMDB search error:", err.response?.data || err.message);
    res.status(500).json({ msg: "Failed to fetch TMDB data" });
  }
});

// Proxy TMDB genres
router.get("/tmdb/genres", async (req, res) => {
  try {
    console.log("Fetching TMDB genres");
    const response = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`
    );
    console.log("TMDB genres response:", response.data.genres.length, "genres");
    res.json(response.data);
  } catch (err) {
    console.error("TMDB genres error:", err.response?.data || err.message);
    res.status(500).json({ msg: "Failed to fetch TMDB genres" });
  }
});

// Existing routes (unchanged)
router.post("/favorite", auth, async (req, res) => {
  const { tmdbId, title, posterPath } = req.body;
  try {
    console.log("Received favorite request:", req.body);
    if (!tmdbId || !title) {
      return res.status(400).json({ msg: "Missing required fields" });
    }
    let movie = await Movie.findOne({ tmdbId, userId: req.user.id });
    if (movie) {
      return res.status(400).json({ msg: "Movie already in favorites" });
    }
    movie = new Movie({ tmdbId, title, posterPath: posterPath || "", userId: req.user.id });
    await movie.save();
    await User.findByIdAndUpdate(req.user.id, { $push: { favorites: movie._id } });
    console.log("Movie saved:", movie);
    res.json(movie);
  } catch (err) {
    console.error("Favorite error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/favorites", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    console.log("Fetching favorites, page:", page, "limit:", limit);
    const movies = await Movie.find({ userId: req.user.id })
      .skip(skip)
      .limit(limit);
    const totalMovies = await Movie.countDocuments({ userId: req.user.id });
    const totalPages = Math.ceil(totalMovies / limit);
    console.log("Favorites found:", movies.length, "Total pages:", totalPages);
    res.json({
      movies,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error("Favorites error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/favorite/:id", auth, async (req, res) => {
  try {
    console.log("Deleting favorite, tmdbId:", req.params.id);
    const movie = await Movie.findOne({ tmdbId: req.params.id, userId: req.user.id });
    if (!movie) {
      return res.status(404).json({ msg: "Movie not found" });
    }
    await Movie.findByIdAndDelete(movie._id);
    await User.findByIdAndUpdate(req.user.id, { $pull: { favorites: movie._id } });
    console.log("Movie deleted:", movie);
    res.json({ msg: "Movie removed" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;