import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/SignUp.css';
const Registration = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '', // Add confirmation password state
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Password and confirmation password don't match.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5232/api/auth/register/customer', formData);
      // Handle successful registration, e.g., redirect to login page
      console.log(response.data);
    } catch (error) {
      // Handle registration error
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="register-button">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Registration;