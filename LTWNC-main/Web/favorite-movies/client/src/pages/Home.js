import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import axios from "axios";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [loading, setLoading] = useState(false); // Added for UX

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        console.log("Fetching genres");
        const res = await axios.get("http://localhost:5000/api/movies/tmdb/genres");
        console.log("Genres received:", res.data.genres);
        setGenres(res.data.genres || []);
      } catch (err) {
        console.error("Fetch genres error:", err.response?.data || err.message);
        setError("Failed to load genres.");
      }
    };
    fetchGenres();
  }, []);

  // Fetch popular movies
  const fetchPopularMovies = async (page = 1, genreId = selectedGenre) => {
    setLoading(true);
    try {
      console.log("Fetching popular movies, page:", page, "genreId:", genreId);
      const url = `http://localhost:5000/api/movies/tmdb/popular?page=${page}${
        genreId ? `&genreId=${genreId}` : ""
      }`;
      const res = await axios.get(url);
      // Client-side filter to ensure genre match
      const filteredMovies = genreId
        ? res.data.results.filter((movie) =>
            movie.genre_ids.includes(parseInt(genreId))
          )
        : res.data.results;
      console.log("Filtered popular movies:", filteredMovies);
      setMovies(filteredMovies);
      setCurrentPage(page);
      setTotalPages(res.data.total_pages > 100 ? 100 : res.data.total_pages);
      setError("");
    } catch (err) {
      console.error("Fetch popular error:", err.response?.data || err.message);
      setError("Failed to fetch popular movies.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (searchQuery, page = 1, genreId = selectedGenre) => {
    setQuery(searchQuery);
    setIsSearching(true);
    setLoading(true);
    setError("");
    try {
      console.log("Searching for:", searchQuery, "page:", page, "genreId:", genreId);
      const url = `http://localhost:5000/api/movies/tmdb/search?query=${encodeURIComponent(
        searchQuery
      )}&page=${page}${genreId ? `&genreId=${genreId}` : ""}`;
      const res = await axios.get(url);
      // Client-side filter
      const filteredMovies = genreId
        ? res.data.results.filter((movie) =>
            movie.genre_ids.includes(parseInt(genreId))
          )
        : res.data.results;
      console.log("Filtered search results:", filteredMovies);
      if (filteredMovies.length === 0) {
        setError("No movies found. Try a different search term or genre.");
        setMovies([]);
        setTotalPages(1);
      } else {
        setMovies(filteredMovies);
        setCurrentPage(page);
        setTotalPages(res.data.total_pages > 100 ? 100 : res.data.total_pages);
      }
    } catch (err) {
      console.error("Search error:", err.response?.data || err.message);
      setError("Failed to fetch movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle genre change
  const handleGenreChange = (e) => {
    const genreId = e.target.value;
    console.log("Genre changed to:", genreId);
    setSelectedGenre(genreId);
    setCurrentPage(1); // Reset to page 1
    if (isSearching && query) {
      handleSearch(query, 1, genreId);
    } else {
      fetchPopularMovies(1, genreId);
    }
  };

  // Handle add to favorites
  const handleAdd = async (movie) => {
    try {
      console.log("Sending add request for:", movie);
      const response = await axios.post(
        "http://localhost:5000/api/movies/favorite",
        {
          tmdbId: movie.id.toString(),
          title: movie.title,
          posterPath: movie.poster_path || "",
        },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      console.log("Add response:", response.data);
      alert("Movie added to favorites!");
    } catch (err) {
      console.error("Add error:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Failed to add movie.");
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    console.log("Page change requested to:", page);
    if (page >= 1 && page <= totalPages) {
      if (isSearching && query) {
        handleSearch(query, page, selectedGenre);
      } else {
        fetchPopularMovies(page, selectedGenre);
      }
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPopularMovies();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between my-4">
        <SearchBar onSearch={(q) => handleSearch(q, 1, selectedGenre)} />
        <div className="mt-2 sm:mt-0">
          <select
            value={selectedGenre}
            onChange={handleGenreChange}
            className="p-2 border rounded w-full sm:w-auto"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && <p className="text-red-500 text-center my-4">{error}</p>}
      {loading ? (
        <p className="text-center my-4">Loading movies...</p>
      ) : movies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onAdd={handleAdd} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p className="text-center my-4">
          {error || "No movies found. Try a different genre or search term."}
        </p>
      )}
    </div>
  );
};

export default Home;