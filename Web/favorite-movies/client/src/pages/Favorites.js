import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";

const Favorites = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        console.log("Fetching favorites, page:", currentPage); // Debug
        const res = await axios.get(
          `http://localhost:5000/api/movies/favorites?page=${currentPage}&limit=8`,
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        );
        console.log("Favorites data:", res.data); // Debug
        setMovies(res.data.movies || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Fetch favorites error:", err.response?.data || err.message); // Debug
      }
    };
    fetchFavorites();
  }, [currentPage]);

  const handleRemove = async (tmdbId) => {
    try {
      await axios.delete(`http://localhost:5000/api/movies/favorite/${tmdbId}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setMovies(movies.filter((movie) => movie.tmdbId !== tmdbId));
    } catch (err) {
      alert("Failed to remove movie");
    }
  };

  const handlePageChange = (page) => {
    console.log("Favorites page change to:", page); // Debug
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold my-4">Your Favorite Movies</h2>
      {movies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} onRemove={handleRemove} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p className="text-center my-4">No favorite movies yet. Add some from the home page!</p>
      )}
    </div>
  );
};

export default Favorites;