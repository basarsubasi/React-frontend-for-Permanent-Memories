import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Films.css'; // Assuming similar styling as SearchItems

const FilmsPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [filter, setFilter] = useState({
    title: '',
    minPrice: '',
    maxPrice: '',
    isAvailable: '',
    brand: '',
    sortOrder: 'ascending',
  });
  const navigate = useNavigate();

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5232/api/Item/searchItems`, {
        params: {
          itemType: 0,
          title: filter.title,
          minPrice: filter.minPrice !== '' ? parseFloat(filter.minPrice) : null,
          maxPrice: filter.maxPrice !== '' ? parseFloat(filter.maxPrice) : null,
          isAvailable: filter.isAvailable !== '' ? filter.isAvailable === 'true' : null,
          brand: filter.brand,
          descending: filter.sortOrder === 'descending',
        },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching films:', error);
    }
  };

  const handleFilterChange = (event) => {
    setFilter({ ...filter, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSearch();
  };

  const navigateToProduct = (guid) => {
    navigate(`/product/${guid}`);
  };

  return (
    <div className="film-items-container">
      <h2 className="film-items-title">Films</h2>

      <form onSubmit={handleSubmit} className="film-filter-form">
        <input
          type="text"
          name="title"
          placeholder="Search by Title"
          value={filter.title}
          onChange={handleFilterChange}
        />

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

        <select name="isAvailable" value={filter.isAvailable} onChange={handleFilterChange}>
          <option value="">Any Availability</option>
          <option value="true">In Stock</option>
          
        </select>

        <select name="brand" value={filter.brand} onChange={handleFilterChange}>
          <option value="">Select Brand</option>
          <option value="Kodak">Kodak</option>
          <option value="Agfa">Agfa</option>
          <option value="Canon">Canon</option>
          <option value="Ilford">Ilford</option>
          {/* Add more brands as needed */}
        </select>

        <select name="sortOrder" value={filter.sortOrder} onChange={handleFilterChange}>
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>

        <button type="submit">Apply Filters</button>
      </form>

      {searchResults.length === 0 ? (
        <div className="no-results-message">
          No films found matching the filters.
        </div>
      ) : (
        <div className="film-results-grid">
          {searchResults.map((film) => (
            <div className="film-item-card" key={film.GUID}>
              <img src={film.TitleImageUrl} alt={film.Title} className="item-image" />
              <div className="item-content">
                <h3 className="item-title" onClick={() => navigateToProduct(film.GUID)}>
                  {film.Title}
                </h3>
                <div className="item-description">{film.Description}</div>
                <div className={`item-availability ${!film.IsAvailable ? 'out-of-stock' : ''}`}>
                  {film.IsAvailable ? 'In stock' : 'Out of stock'}
                </div>
                <div className="item-price">₺{film.Price.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilmsPage;
