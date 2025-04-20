import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Favorite Movies. All rights reserved.</p>
        <div className="mt-2">
          <a href="/about" className="hover:text-gray-300 mx-2">
            About
          </a>
          <a href="/contact" className="hover:text-gray-300 mx-2">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;