import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Cameras.css'; // Assuming similar styling as SearchItems


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

const CamerasPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [filter, setFilter] = useState({
    title: '',
    minPrice: '',
    maxPrice: '',
    isAvailable: '',
    brand: '',
    sortOrder: 'SortOrder',
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
    setFilter({ ...filter, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSearch();
  };

  const navigateToProduct = (GUID) => {
    navigate(`/product/${GUID}`);
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
    <div className="item-items-container">
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

        <button type="camera-filter-form">Apply Filters</button>
      </form>

      {searchResults.length === 0 ? (
        <div className="no-results-message">
          No cameras found matching the filters.
        </div>
      ) : (
        <div className="camera-results-grid">
          {searchResults.map((item) => (
            <div className="camera-item-card" key={item.GUID}>
              <img src={item.TitleImageUrl} alt={item.Title} className="item-image" />
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

export default CamerasPage;
