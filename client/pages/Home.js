import { useState } from "react";
import { searchBooks } from "../api";
import logo from "../assets/logo.png";

const Home = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);

  const handleSearch = async () => {
    const { data } = await searchBooks(query);
    setBooks(data);
  };

  return (
    <div className="p-8 text-center">
      <img src={logo} alt="BookAdvisor Logo" className="w-32 mx-auto" />
      <h1 className="text-2xl font-bold text-primary mb-4">Rechercher un Livre</h1>
      <input
        className="border p-2 w-64"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Titre, auteur..."
      />
      <button onClick={handleSearch} className="bg-primary text-white px-4 py-2 ml-2">
        Rechercher
      </button>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {books.map((book, index) => (
          <div key={index} className="p-4 border">
            <h3 className="font-bold">{book.title}</h3>
            <p>{book.author}</p>
            <img src={book.image} alt={book.title} className="w-24 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;