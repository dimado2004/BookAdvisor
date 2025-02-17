const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Book = require('../models/Book');

// Obtenir les infos du profil : livres aimés, commentaires et abonnés
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('likedBooks', 'title author image')
      .populate('comments.bookId', 'title')
      .populate('followers', 'username');

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({
      username: user.username,
      likedBooks: user.likedBooks,
      comments: user.comments,
      followers: user.followers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Suivre un utilisateur
router.post('/:userId/follow', async (req, res) => {
    try {
      const { followerId } = req.body;
      const user = await User.findById(req.params.userId);
      const follower = await User.findById(followerId);
  
      if (!user || !follower) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      if (!user.followers.includes(followerId)) {
        user.followers.push(followerId);
        await user.save();
        return res.json({ message: "Abonné avec succès", followers: user.followers });
      }
      
      res.status(400).json({ message: "Déjà abonné" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Se désabonner
  router.post('/:userId/unfollow', async (req, res) => {
    try {
      const { followerId } = req.body;
      const user = await User.findById(req.params.userId);
  
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      user.followers = user.followers.filter(id => id.toString() !== followerId);
      await user.save();
  
      res.json({ message: "Désabonné avec succès", followers: user.followers });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });  


module.exports = router;