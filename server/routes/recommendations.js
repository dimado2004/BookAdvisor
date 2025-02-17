const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Book = require('../models/Book');

// Route pour récupérer les recommandations de livres avec pagination
router.get('/:userId', async (req, res) => {
  const page = parseInt(req.query.page) || 1;  // Page courante (par défaut 1)
  const limit = 10;  // Nombre de livres à afficher par page
  const skip = (page - 1) * limit;  // Nombre d'éléments à ignorer pour la pagination

  try {
    // Récupérer l'utilisateur avec ses livres aimés
    const user = await User.findById(req.params.userId).populate('likedBooks');

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Extraire les genres des livres aimés par l'utilisateur
    const likedGenres = user.likedBooks.map(book => book.genre);

    // Agrégation MongoDB pour récupérer les livres recommandés en fonction des genres aimés
    const recommendedBooks = await Book.aggregate([
      { $match: { genre: { $in: likedGenres }, _id: { $nin: user.likedBooks.map(book => book._id) } } },
      { $skip: skip },  // Sauter les livres déjà affichés dans les pages précédentes
      { $limit: limit },  // Limiter à "limit" livres par page
      { $project: { title: 1, author: 1, genre: 1 } }  // Sélectionner les champs nécessaires
    ]);

    res.json(recommendedBooks);  // Retourner les livres recommandés à l'utilisateur
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;