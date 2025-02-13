const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  description: String,
  image: String,
  ratings: [{ user: String, rating: Number }],
  averageRating: { type: Number, default: 0 }
});

module.exports = mongoose.model("Book", BookSchema);