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
    sortOrder: 'Sort Order',
  });
  const [availableBrands] = useState(['Kodak', 'AgfaPhoto', 'Canon', 'Ilford', "Fujifilm"]); // Replace with your brands list
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
          sortBy: filter.sortBy,

        },
      });

      
      if (response.status === 200) {
        setSearchResults(response.data);
      } else if (response.status === 404) {
        // If the response is 404 (NotFound), set the searchResults to an empty array
        setSearchResults([]);
        alert('No items found matching the filters.');
      }
  
    } catch (error) {
      console.error('Error fetching cameras:', error);
      // Handle other types of errors (like network issues) here
      // Optionally, clear the search results or provide a different user feedback
      setSearchResults([]);
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

  const navigateToProduct = (GUID) => {
    navigate(`/product/${GUID}`); // Navigate to the ProductPage with the GUID
  };

  const addToCart = (item, quantityToPurchase) => {

    if (!item.IsAvailable) {
      alert('This item is out of stock');
      return;
    }
    if (item.Quantity < quantityToPurchase) {
      alert('There is not enough stock to purchase this quantity');
      return;
    }
    let cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    // Find the index of the item in the cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.GUID === item.GUID);
  
    // Parse the quantity to purchase as an integer, default to 1 if undefined
    const quantity = parseInt(quantityToPurchase, 10) || 1;
  
    if (existingItemIndex !== -1) {
      // If the item exists, update the quantity to purchase
      cart[existingItemIndex].quantityToPurchase += quantity;
    } else {
      // If the item doesn't exist, add the new item with the quantity to purchase
      cart.push({ ...item, quantityToPurchase: quantity });
    }
  
    // Save the updated cart back to session storage
    sessionStorage.setItem('cart', JSON.stringify(cart));
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

<select name="sortBy" value={filter.sortBy} onChange={handleFilterChange}>
          <option value="">Sort By</option>
          <option value="title">Title</option>
          <option value="price">Price</option>
          <option value="quantity">Quantity</option>
          {/* Add more sort options as needed */}
        </select>

        <select name="sortOrder" value={filter.sortOrder} onChange={handleFilterChange}>
          <option value="">Sort Order</option>
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>

        

        <button type="search-filter-form">Apply Filters</button>
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
              
              <input
              type="number"
              min="1"
              defaultValue="1"
              onChange={(e) => item.quantityToPurchase = parseInt(e.target.value, 10)}
              className="quantity-input"
            />
            <button
              onClick={() => addToCart(item, item.quantityToPurchase)}
              className="add-to-cart-button"
            >
              Add to Cart
            </button>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchItems;
