import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../Styles/Search.css';


const SearchItems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const term = searchParams.get('term');

    if (term) {
      setSearchTerm(term);
      handleSearch(term);
    }
  }, [location.search]);

  const handleSearch = async (term) => {
    try {
      const response = await axios.get(`http://localhost:5232/api/Item/searchItems`, {
        params: {
          title: term,
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
      <h2 className="search-items-title">Search Results for "{searchTerm}"</h2>
      <div className="search-results-grid">
        {searchResults.map((item) => (
          <div className="search-item-card" key={item.GUID}>
            <img src={item.TitleImageUrl} alt={item.Title} className="item-image" style={{ width: '338px', height: '149px' }} />
            <div className="item-content">
              <h3 className="item-title">{item.Title}</h3>
              <div className="item-description">{item.Description}</div>
              <div
              className={`item-availability ${!item.IsAvailable ? 'out-of-stock' : ''}`}
            >
              {item.IsAvailable ? 'In stock' : 'Out of stock'}
            </div>
              <div className="item-price">₺{item.Price.toFixed(2)}</div>
              <div className="item-actions">
                {/* Icons or buttons for actions */}
                {/* Replace with actual buttons or icons */}
                <span>🔊</span> 
                <span>❤️</span>
                <span>🛒</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchItems;