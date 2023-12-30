import React, { useState } from 'react';
import axios from 'axios';
import './Search.css'; // Replace with the correct path to your CSS file

const SearchItems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5232/api/Item/searchItems`, {
        params: {
          title: searchTerm,
          descending: false,
        },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching items:', error);
    }
  };

  return (
    <div className="search-items-container">
      <h2 className="search-items-title">Search Items</h2>
      <div>
        <input
          type="text"
          className="search-items-input"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-items-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      <ul className="search-items-list">
        {searchResults.map((item) => (
          <li className="search-items-item" key={item.GUID}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchItems;
