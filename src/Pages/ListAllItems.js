import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import '../Styles/ItemsList.css'; // Import your CSS file

const ItemsListPage = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState({
    itemType: '',
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
          itemType: filter.itemType,
          title: filter.title,
          minPrice: filter.minPrice !== '' ? parseFloat(filter.minPrice) : null,
          maxPrice: filter.maxPrice !== '' ? parseFloat(filter.maxPrice) : null,
          isAvailable: filter.isAvailable !== '' ? filter.isAvailable === 'true' : null,
          brand: filter.brand,
          descending: filter.sortOrder === 'descending',
        },
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
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

  const handleEditItem = (guid) => {
    navigate(`/edititem/${guid}`);
  };

  const handleDeleteItem = async (guid) => {
    try {
      const response = await axios.delete(`http://localhost:5232/api/Item/deleteItem/${guid}`, {  withCredentials: true
        // You may need to pass any required headers or authentication tokens here
      });

      if (response.status === 200) {
        // Item deleted successfully, you can update the UI or show a confirmation message
        setItems((prevItems) => prevItems.filter((item) => item.GUID !== guid));
      // You can also show a confirmation message
      alert(`Item with GUID ${guid} has been deleted.`);
        // You can also remove the item from the state if it's still displayed
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="items-list-container">
      <h2 className="items-list-title">List All Items</h2>

      <form onSubmit={handleSubmit} className="items-list-filter-form">
        <select name="itemType" value={filter.itemType} onChange={handleFilterChange}>
          <option value="">All Item Types</option>
          <option value="0">Films</option>
          <option value="1">Cameras</option>
          {/* Add more item types as needed */}
        </select>

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

      <div className="items-list-grid">
        {items.map((item) => (
          <div className="item-card" key={item.GUID}>
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
              <div className="item-actions">
                <button className="edit-button" onClick={() => handleEditItem(item.GUID)}>
                Edit Item
               </button>
               <button className="delete-button" onClick={() => handleDeleteItem(item.GUID)}>
             Delete
               </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsListPage;
