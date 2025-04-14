import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center my-4">
      <button
        onClick={() => {
          console.log("Previous clicked, currentPage:", currentPage); // Debug
          onPageChange(currentPage - 1);
        }}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="px-4 py-2 mx-1 bg-blue-500 text-white rounded">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => {
          console.log("Next clicked, currentPage:", currentPage); // Debug
          onPageChange(currentPage + 1);
        }}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;