const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  tmdbId: { type: String, required: true },
  title: { type: String, required: true },
  posterPath: { type: String }, // Allow empty string
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Movie", movieSchema);