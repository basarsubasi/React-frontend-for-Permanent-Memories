import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/OrdersList.css'; // Import your CSS file

const OrdersListPage = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState({
    userName: '',
    minPrice: '',
    maxPrice: '',
    orderDate: '',
    sortOrder: 'ascending',
  });
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState({});

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
        const response = await axios.get(`http://localhost:5232/api/Order/listOrders`, {
            withCredentials: true,
            params: {
              OrderId: filter.OrderId,
              userName: filter.userName,
              minPrice: filter.minPrice !== '' ? parseFloat(filter.minPrice) : null,
              maxPrice: filter.maxPrice !== '' ? parseFloat(filter.maxPrice) : null,
              orderDate: filter.orderDate,
              sortOrder: filter.sortOrder,
            },
          });

        setOrders(response.data);
      
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Handle 404 error specifically
        setOrders([]);
        alert('No items found matching the filters.');
      } 
       if (error.response && error.response.status === 400) {
        // Handle 400 error specifically
        setOrders([]);
        alert(" 400 Bad Request"); }
      
      else {
        // Handle other errors
        console.error('Error fetching orders:', error);
      }
    }
  };


  const handleFilterChange = (event) => {
    setFilter({ ...filter, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSearch();
  };

  const handleUpdateOrderStatus = async (OrderId) => {
    try {
      const newStatus = selectedStatus[OrderId]; // Get the selected status for this order
      if (!newStatus) {
        alert("Please select a status before updating.");
        return;
      }

      const response = await axios.put(`http://localhost:5232/api/Order/updateOrderStatus/${OrderId}`, { newStatus }, { withCredentials: true });
      if (response.status === 200) {
        alert(`Order status updated to ${newStatus}.`);
        // Optionally, refresh the list or update the status in the UI
        handleSearch();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleStatusSelect = (OrderId, status) => {
    setSelectedStatus({
      ...selectedStatus,
      [OrderId]: status
    });
  };


  const handleDeleteOrder = async (OrderId) => {
    try {
      const response = await axios.delete(`http://localhost:5232/api/Order/deleteOrder/${OrderId}`, {withCredentials: true});
      if (response.status === 200) {
        setOrders((prevOrders) => prevOrders.filter((order) => order.OrderId !== OrderId));
        alert(`Order with ID ${OrderId} has been deleted.`);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <div className="orders-list-container">
      <h2 className="orders-list-title">List All Orders</h2>

      <form onSubmit={handleSubmit} className="orders-list-filter-form">

      <input
          type="text"
          name="OrderId"
          placeholder="Search by OrderId"
          value={filter.OrderId}
          onChange={handleFilterChange}
        />

        <input
          type="text"
          name="userName"
          placeholder="Search by User Name"
          value={filter.userName}
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

        <input
          type="date"
          name="orderDate"
          placeholder="Order Date"
          value={filter.orderDate}
          onChange={handleFilterChange}
        />

        <select name="sortOrder" value={filter.sortOrder} onChange={handleFilterChange}>
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>

        <button type="submit">Apply Filters</button>
      </form>

      <div className="orders-list-grid">
        {orders.map((order) => (
          <div className="order-card" key={order.OrderId}>
            {/* Display order details */}
            <div className="order-details">
              <p>Order ID: {order.OrderId}</p>
              <p>User: {order.UserName}</p>
              <p>Date: {new Date(order.DatePlaced).toLocaleDateString()}</p>
              <p>Total Price: ${order.TotalPrice.toFixed(2)}</p>
              <p>Status: {order.Status}</p>
            </div>
            <div className="order-actions">
              <button className="update-status-button" onClick={() => handleUpdateOrderStatus(order.OrderId)}>
                Update Status
              </button>
              <button className="delete-button" onClick={() => handleDeleteOrder(order.OrderId)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersListPage;
