import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Cameras.css'; // Assuming similar styling as SearchItems

const CamerasPage = () => {
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
          itemType: 1,
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
      console.error('Error fetching cameras:', error);
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
    <div className="camera-items-container">
      <h2 className="camera-items-title">Cameras</h2>

      <form onSubmit={handleSubmit} className="camera-filter-form">
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

        <button type="camera-filter-form">Apply Filters</button>
      </form>

      {searchResults.length === 0 ? (
        <div className="no-results-message">
          No cameras found matching the filters.
        </div>
      ) : (
        <div className="camera-results-grid">
          {searchResults.map((camera) => (
            <div className="camera-item-card" key={camera.GUID}>
              <img src={camera.TitleImageUrl} alt={camera.Title} className="item-image" />
              <div className="item-content">
                <h3 className="item-title" onClick={() => navigateToProduct(camera.GUID)}>
                  {camera.Title}
                </h3>
                <div className="item-description">{camera.Description}</div>
                <div className={`item-availability ${!camera.IsAvailable ? 'out-of-stock' : ''}`}>
                  {camera.IsAvailable ? 'In stock' : 'Out of stock'}
                </div>
                <div className="item-price">₺{camera.Price.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CamerasPage;
