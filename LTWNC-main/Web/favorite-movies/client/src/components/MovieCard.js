import React from "react";

const MovieCard = ({ movie, onAdd, onRemove }) => {
  const posterPath = movie.posterPath || movie.poster_path || "";
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <img
        src={
          posterPath
            ? `https://image.tmdb.org/t/p/w200${posterPath}`
            : "https://placehold.co/200x300?text=No+Image"
        }
        alt={movie.title}
        className="w-full h-48 object-cover rounded"
        onError={(e) => {
          e.target.src = "https://placehold.co/200x300?text=Error";
        }}
      />
      <h3 className="text-lg font-bold mt-2">{movie.title}</h3>
      {onAdd && (
        <button
          onClick={() => {
            console.log("Add clicked for movie:", movie);
            onAdd(movie);
          }}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add to Favorites
        </button>
      )}
      {onRemove && (
        <button
          onClick={() => onRemove(movie.tmdbId || movie._id)}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
        >
          Remove
        </button>
      )}
    </div>
  );
};

export default MovieCard;