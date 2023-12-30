// Components/SearchBar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/SearchBar.css'; // Make sure this path is correct

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <Link to={`/search?term=${searchTerm}`} className="search-button-link">
          <button type="submit" className="search-button">Search</button>
        </Link>
        </div>

      <div className="brand-name">
        Permanent Memories
      </div>
      
      <div className="auth-buttons">
        <Link to="/signup" className="signup-button">Signup</Link>
        <Link to="/login" className="login-button">Login</Link>
      </div>
    </div>
  );
};

export default SearchBar;
