import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/CustomerDashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user'));
  const userId = user.UserId;
  const UserName = user.UserName;

  const goToMyOrders = () => {
    navigate(`/myorders/${userId}`);
  };

  return (
    <div className="customer-dashboard">
      <h1>Welcome to Your Dashboard {UserName}</h1>
      {/* Other dashboard content */}
      <button onClick={goToMyOrders} className="my-orders-button">
        My Orders
      </button>
    </div>
  );
};

export default CustomerDashboard;
