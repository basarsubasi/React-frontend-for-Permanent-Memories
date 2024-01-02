import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/SignUp.css';

const Registration = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });


  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidPassword(formData.password)) {
      alert('Password must contain at least one uppercase letter, one number, and one special character, and be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    try {
      await axios.post('http://localhost:5232/api/auth/register/employee', formData , {withCredentials: true});
      alert('Registration successful!');
      window.location.reload()
    } catch (error) {

     // Check the status code of the response
     if (error.response && error.response.status === 400) {
      // Check if the error is due to a duplicate email
      alert(`Registration failed: BadRequest`);
   
    } else {
      // Handle other types of errors
      alert(`Registration failed: ${error.response?.data?.message || 'An unexpected error occurred. Please try again later.'}`);
    }
  }
};

  
  return (
    <div className="registration-container">
      <div className="registration-card">
        <h2>Register Employee</h2>
        <p>Password must contain at least one uppercase letter, one number, and one special character, and be at least 6 characters long.</p>
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
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
