const [comments, setComments] = useState(book.comments || []);
const [newComment, setNewComment] = useState("");

const handleCommentSubmit = async (e) => {
  e.preventDefault();
  if (!newComment.trim()) return;

  const response = await fetch(`http://localhost:5000/books/${book._id}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: "Moi", text: newComment }),
  });

  if (response.ok) {
    const updatedComments = await response.json();
    setComments(updatedComments);
    setNewComment(""); 
  }
};

const handleShare = () => {
    const bookUrl = `${window.location.origin}/books/${book._id}`;
    navigator.clipboard.writeText(bookUrl);
    alert("Lien copié dans le presse-papiers !");
  };
  
  <button onClick={handleShare}>Partager 📤</button>
  

return (
  <div>
    <h3>{book.title}</h3>
    <button onClick={handleLike}>J'aime ❤️ {likes}</button>

    <div>
      <h4>Commentaires</h4>
      <ul>
        {comments.map((comment, index) => (
          <li key={index}><strong>{comment.user}:</strong> {comment.text}</li>
        ))}
      </ul>
      <form onSubmit={handleCommentSubmit}>
        <input 
          type="text" 
          value={newComment} 
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ajoutez un commentaire..."
        />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  </div>
);