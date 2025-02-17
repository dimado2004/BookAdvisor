import { useQuery } from '@tanstack/react-query';
import { useState, useRef, useCallback } from 'react';

const RecommendedBooks = ({ userId }) => {
  const [page, setPage] = useState(1); // Page pour les recommandations paginées
  const fetchRecommendations = async (page) => {
    const res = await fetch(`http://localhost:5000/recommendations/${userId}?page=${page}`);
    if (!res.ok) {
      throw new Error('Erreur lors de la récupération des recommandations');
    }
    return res.json();
  };

  const { data: recommendedBooks, isLoading, isError, isFetching } = useQuery(
    ['recommendedBooks', userId, page],
    () => fetchRecommendations(page),
    { keepPreviousData: true }
  );

  const observer = useRef();
  const lastBookElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !isFetching) {
        setPage(prevPage => prevPage + 1); // Charger la page suivante
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, isFetching]);

  if (isLoading) return <p>Chargement des recommandations...</p>;
  if (isError) return <p>Erreur de récupération des recommandations</p>;

  return (
    <div className="recommended-books">
      <h2>📌 Livres recommandés pour vous</h2>
      <ul>
        {recommendedBooks.map((book, index) => (
          <li
            key={book._id}
            ref={index === recommendedBooks.length - 1 ? lastBookElementRef : null}
          >
            <strong>{book.title}</strong> - {book.author}
          </li>
        ))}
      </ul>
      {isFetching && <p>Chargement des livres supplémentaires...</p>}
    </div>
  );
};

export default RecommendedBooks;