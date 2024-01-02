import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../Styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Function to handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <button onClick={() => handleNavigation('/createitem')}>Create New Item</button>
      <button onClick={() => handleNavigation('/listallitems')}>List All Items</button>
      <button onClick={() => handleNavigation('/listusers')}>List All Users</button>
      <button onClick={() => handleNavigation('/registeremployee')}>Register New Employee</button>
    </div>
  );
};

export default AdminDashboard;
