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

// Ajouter un like à un livre
router.post('/:id/like', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Livre non trouvé" });

    book.likes += 1;
    await book.save();
    res.json({ message: "Like ajouté", likes: book.likes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un like à un livre
router.delete('/:id/like', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Livre non trouvé" });

    if (book.likes > 0) {
      book.likes -= 1;
      await book.save();
    }
    res.json({ message: "Like supprimé", likes: book.likes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ajouter un commentaire à un livre
router.post('/:id/comment', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Livre non trouvé" });

    const comment = {
      user: req.body.user,
      text: req.body.text,
      date: new Date(),
    };

    book.comments.push(comment);
    await book.save();
    res.json({ message: "Commentaire ajouté", comments: book.comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un commentaire d'un livre
router.delete('/:id/comment/:commentId', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Livre non trouvé" });

    book.comments = book.comments.filter(comment => comment._id.toString() !== req.params.commentId);
    await book.save();
    res.json({ message: "Commentaire supprimé", comments: book.comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Partager un livre (logique à définir)
router.post('/:id/share', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Livre non trouvé" });

    // Ici, tu peux ajouter une logique pour enregistrer le partage, envoyer un email, etc.
    res.json({ message: `Livre partagé avec succès !`, book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;