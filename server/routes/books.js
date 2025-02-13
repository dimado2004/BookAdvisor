const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/search", async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_BOOKS_API_KEY}`);
    const books = response.data.items.map(item => ({
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] || "Auteur inconnu",
      genre: item.volumeInfo.categories?.[0] || "Non classé",
      description: item.volumeInfo.description || "Aucune description",
      image: item.volumeInfo.imageLinks?.thumbnail || "",
    }));
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la recherche", error });
  }
});

module.exports = router;