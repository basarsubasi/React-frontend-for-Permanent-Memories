import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/ListUsers.css';

const ListUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState(''); // Initialize with an empty role

  useEffect(() => {
    fetchUsers(selectedRole); // Fetch users initially with the selected role
  }, [selectedRole]); // Re-fetch users when the selectedRole changes

  const fetchUsers = async (role) => {
    try {
      const response = await axios.get(`http://localhost:5232/api/Auth/GetUsers`, {
        params: {
          role: role, // Pass the selected role as a parameter
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(`http://localhost:5232/api/Auth/deleteUsers/${userId}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        // User deleted successfully
        setUsers((prevUsers) => prevUsers.filter((user) => user.UserId !== userId));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="list-users-container">
      <h2>List Users</h2>
      <label>Select Role:</label>
      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
      >
        <option value="">Select Role</option>
        <option value="employee">Employee</option>
        <option value="customer">Customer</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.UserId}>
              <td>{user.UserId}</td>
              <td>{user.UserName}</td>
              <td>
                <button onClick={() => handleDeleteUser(user.UserId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListUsersPage;
