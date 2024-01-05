import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../Styles/AdminDashboard.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  // Function to handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-dashboard">
      <h1>Employee Dashboard</h1>
      <button onClick={() => handleNavigation('/listallitems')}>List All Items</button>
      <button onClick={() => handleNavigation('/listallorders')}>List All Orders</button>

    </div>
  );
};

export default EmployeeDashboard;
