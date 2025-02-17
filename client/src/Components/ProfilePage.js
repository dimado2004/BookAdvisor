import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
    <nav>
      <Link to="/">Accueil</Link>
      <Link to="/profile/monUserId">Mon Profil</Link>
    </nav>
  );
  
  export default Navbar;

const ProfilePage = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/profile/${userId}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setIsFollowing(data.followers.some(f => f._id === userId));
      })
      .catch(error => console.error("Erreur :", error));
  }, [userId]);

  const handleFollow = async () => {
    const response = await fetch(`http://localhost:5000/profile/${userId}/follow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followerId: "monUserId" }) // Remplace par l'ID de l'utilisateur connecté
    });

    if (response.ok) {
      setIsFollowing(true);
    }
  };

  const handleUnfollow = async () => {
    const response = await fetch(`http://localhost:5000/profile/${userId}/unfollow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followerId: "monUserId" })
    });

    if (response.ok) {
      setIsFollowing(false);
    }
  };

  if (!profile) return <p>Chargement...</p>;

  return (
    <div className="profile-page">
      <h2>Profil de {profile.username}</h2>

      <h3>📚 Livres aimés</h3>
      <ul>
        {profile.likedBooks.map(book => (
          <li key={book._id}>{book.title} - {book.author}</li>
        ))}
      </ul>

      <h3>💬 Commentaires postés</h3>
      <ul>
        {profile.comments.map(comment => (
          <li key={comment._id}>
            {comment.text} (sur <strong>{comment.bookId.title}</strong>)
          </li>
        ))}
      </ul>

      <h3>👥 Abonnés</h3>
      <ul>
        {profile.followers.map(follower => (
          <li key={follower._id}>{follower.username}</li>
        ))}
      </ul>

      {isFollowing ? (
        <button onClick={handleUnfollow}>Se désabonner</button>
      ) : (
        <button onClick={handleFollow}>S'abonner</button>
      )}
    </div>
  );
};
