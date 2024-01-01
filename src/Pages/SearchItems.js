import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../Styles/Search.css';

const SearchItems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filter, setFilter] = useState({
    minPrice: '',
    maxPrice: '',
    isAvailable: '',
    brand: '',
    sortOrder: 'ascending',
  });
  const [availableBrands] = useState(['Kodak', 'Agfa', 'Canon', 'Ilford']); // Replace with your brands list
  const location = useLocation();
  const navigate = useNavigate(); 

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
          minPrice: filter.minPrice !== '' ? filter.minPrice : null,
          maxPrice: filter.maxPrice !== '' ? filter.maxPrice : null,
          isAvailable: filter.isAvailable !== '' ? filter.isAvailable : null,
          brand: filter.brand !== '' ? filter.brand : null,
          descending: filter.sortOrder === 'descending',
        },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching items:', error);
    }
  };

  const handleFilterChange = (event) => {
    setFilter({
      ...filter,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSearch(searchTerm);
  };

  const navigateToProduct = (guid) => {
    navigate(`/product/${guid}`); // Navigate to the ProductPage with the guid
  };

  return (
    <div className="search-items-container">
      <h2 className="search-items-title">Search Results for "{searchTerm}"</h2>

      <form onSubmit={handleSubmit} className="search-filter-form">
        <select name="isAvailable" value={filter.isAvailable} onChange={handleFilterChange}>
          <option value="">Any Availability</option>
          <option value="true">In Stock</option>
        </select>

        <select name="brand" value={filter.brand} onChange={handleFilterChange}>
          <option value="">Select Brand</option>
          {availableBrands.map((brand, index) => (
            <option key={index} value={brand}>{brand}</option>
          ))}
        </select>

        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filter.minPrice}
          onChange={handleFilterChange}
        />

        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filter.maxPrice}
          onChange={handleFilterChange}
        />

        <select name="sortOrder" value={filter.sortOrder} onChange={handleFilterChange}>
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>

        <button type="submit">Apply Filters</button>
      </form>

      {searchResults.length === 0 ? (
        <div className="no-results-message">
          No items found matching the filters.
        </div>
      ) : (
        <div className="search-results-grid">
          {searchResults.map((item) => (
            <div className="search-item-card" key={item.GUID}>
              <img src={item.TitleImageUrl} alt={item.Title} className="item-image" style={{ width: '338px', height: '149px' }} />
              <div className="item-content">
              <h3 className="item-title" onClick={() => navigateToProduct(item.GUID)}>
                  {item.Title}
                </h3>
                <div className="item-description">{item.Description}</div>
                <div className={`item-availability ${!item.IsAvailable ? 'out-of-stock' : ''}`}>
                  {item.IsAvailable ? 'In stock' : 'Out of stock'}
                </div>
                <div className="item-price">₺{item.Price.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchItems;
