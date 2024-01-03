// Components/SearchBar.js
// Components/SearchBar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/SearchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem('user'));
  const isLoggedIn =!!user;
  const UserName= user?.UserName; // Extract the Username from the user object
  const userRoles = user?.Roles; // Default to an empty array if Roles is not present


  const handleLogout = async () => {
    try {
      // Simply clear the session and redirect, without making an API call
      sessionStorage.removeItem('user');
      sessionStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <Link to={`/search?term=${searchTerm}`} className="search-button-link">
          <button type="submit" className="search-button">Search</button>
        </Link>
        </div>

      <div className="brand-name">
        Permanent Memories
      </div>
      

      <div className="auth-buttons">
        {!isLoggedIn && (
          <>
          

            <Link to="/signup" className="signup-button">
              Signup
            </Link>
            <Link to="/login" className="login-button">
              Login
            </Link>
          </>
        )}
        
        {isLoggedIn && (
          <>
          <span className="username-display">Welcome, {UserName}</span>

          {userRoles.includes('Customer') && (
  <>
          <Link to="/shoppingcart" className="cart-button">
          Cart
           </Link>
    
          <Link to="/customerdashboard" className="cart-button">
           Customer Dashboard
              </Link>
              </>
             )}
            {userRoles.includes('Employee') && (
              <Link to="/employeedashboard" className="cart-button">
                Employee Dashboard
              </Link>
            )}

            {userRoles.includes('Admin') && (
              <Link to="/admindashboard" className="cart-button">
                Admin Dashboard
              </Link>
            )}

            <button onClick={handleLogout} className="cart-button">
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchBar;