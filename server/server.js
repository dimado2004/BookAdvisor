require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const redis = require('redis');
const client = redis.createClient(); // Connexion par défaut à Redis (localhost:6379)

 // Vérifier si les recommandations sont en cache
 client.get(cacheKey, async (err, cachedRecommendations) => {
    if (cachedRecommendations) {
      console.log('💡 Utilisation du cache Redis');
      return res.json(JSON.parse(cachedRecommendations)); // Retourner les données en cache
    }

    try {
      const user = await User.findById(req.params.userId).populate('likedBooks');

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      const likedGenres = user.likedBooks.map(book => book.genre);

      // Agrégation MongoDB pour récupérer les recommandations
      const recommendedBooks = await Book.aggregate([
        { $match: { genre: { $in: likedGenres }, _id: { $nin: user.likedBooks.map(book => book._id) } } },
        { $limit: 10 },
        { $project: { title: 1, author: 1, genre: 1 } }
      ]);

      // Stocker les recommandations en cache pour 1 heure (3600 secondes)
      client.setex(cacheKey, 3600, JSON.stringify(recommendedBooks));

      res.json(recommendedBooks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Importer les routes
const booksRoutes = require('./routes/books');
const profileRoutes = require('./routes/profile');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Pour parser le JSON dans les requêtes

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.error("❌ Erreur de connexion MongoDB :", err));

// Routes
app.use('/books', booksRoutes);
app.use('/profile', profileRoutes);

// Route d'accueil
app.get('/', (req, res) => {
  res.send("Bienvenue sur l'API de recommandation de livres 📚 !");
});

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));

const profileRoutes = require('./routes/profile');
app.use('/profile', profileRoutes);


const recommendationsRoutes = require('./routes/recommendations');
app.use('/recommendations', recommendationsRoutes);
