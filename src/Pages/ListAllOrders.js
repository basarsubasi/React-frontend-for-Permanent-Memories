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
    sortOrder: 'Sort Order',
  });

  const user = JSON.parse(sessionStorage.getItem('user'));
  const userRoles = user?.Roles || []; // Default to an empty array if Roles is not present
  const isAdmin = userRoles.includes('Admin');

  const navigate = useNavigate();

 


  useEffect(() => {
    handleSearch();
  }, []);

  const navigateToOrder = (OrderId) => {
    navigate(`/orderpage/${OrderId}`);
  };

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
              sortBy: filter.sortBy,
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

  const [selectedStatus, setSelectedStatus] = useState({});

  const statusOptions = {
    "Pending": 0,
    "Processing": 1,
    "Shipped": 2,
    "Delivered": 3,
    "Cancelled": 4
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
      const newStatusText = selectedStatus[OrderId];
      const newStatusNumber = statusOptions[newStatusText]; // Get the numeric value
  
      if (newStatusNumber === undefined) {
        alert("Please select a valid status before updating.");
        return;
      }
  
      const response = await axios.put(
        `http://localhost:5232/api/Order/updateOrderStatus/${OrderId}`,
        newStatusNumber, // Send just the numeric value
        {
          headers: {
            'Content-Type': 'application/json', // Set the content type to JSON
          },
          withCredentials: true
        }
      );
  
      if (response.status === 200) {
        alert(`Order status updated to ${newStatusText}.`);
        handleSearch(); // Refresh the orders list
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  

  const handleStatusSelect = (OrderId, status) => {
    if (status) {
      setSelectedStatus((prevStatuses) => ({
        ...prevStatuses,
        [OrderId]: status
      }));
    }
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
          placeholder="Search by Username"
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

        
  
        <button type="submit">Apply Filters</button>
      </form>
  
      <div className="orders-list-grid">
        {orders.map((order) => (
          <div className="order-card" key={order.OrderId}>
            {/* Display order details */}
            <div className="order-details" onClick={() => navigateToOrder(order.OrderId)}>
              <p>Order ID: {order.OrderId}</p>
              <p>User: {order.UserName}</p>
              <p>Date: {new Date(order.DatePlaced).toLocaleDateString()}</p>
              <p>Total Price: ₺{order.TotalPrice.toFixed(2)}</p>
              <p>Status: {order.Status}</p>
            </div>
            <div className="order-actions">
            <select
  value={selectedStatus[order.OrderId] ?? ''}
  onChange={(e) => handleStatusSelect(order.OrderId, e.target.value)}
>
  {/* The placeholder option */}
  <option value="" disabled>
    Select Status
  </option>

  {/* The rest of the options */}
  {Object.keys(statusOptions).map((status) => (
    <option key={status} value={status}>
      {status}
    </option>
  ))}
</select>
  
              <button className="update-status-button" onClick={() => handleUpdateOrderStatus(order.OrderId)}>
                Update Status
              </button>
              {isAdmin && (
                <button className="delete-button" onClick={() => handleDeleteOrder(order.OrderId)}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
  

export default OrdersListPage;

