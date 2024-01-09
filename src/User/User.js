import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './User.css'; 

const User = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    // Define fields for adding/editing users
    // id: '',
    // username: '',
    // password: '',
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        // Handle the scenario when the token is not available
        console.error('Access token not found in local storage');
        return;
      }

      const response = await axios.get('http://127.0.0.1:8000/api/users/all/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      if (formData.id) {
        await axios.put(`http://127.0.0.1:8000/api/users/${formData.id}/`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
      } else {
        await axios.post('http://127.0.0.1:8000/api/users/', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
      }
      setFormData({ /* Reset form fields */ });
      fetchUsers();
      setShowUpdateModal(false); // Close the update modal after submission
      setSelectedUser(null); // Reset selected user
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateUser = (user) => {
    setFormData({
      id: user.id,
      username: user.username,
      password: user.password,
      is_active: user.is_active
      // Assuming password can be updated, set other fields as needed
    });
    setSelectedUser(user);
    setShowUpdateModal(true); // Show the update modal
  };

  const deactivateUser = async (userId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${userId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  };

  const handleAddNewUser = () => {
    setShowUpdateModal(true); // Show the add new user modal
    setFormData({ /* Reset form fields */ });
    setSelectedUser(null);
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setSelectedUser(null);
    fetchUsers(); // Fetch users after closing modal
  };

  return (
    <div className="user-container">
      <div className="user-list">
  <table className="user-table">
    <thead>
      <tr>
        {/* Table header */}
        {/* <th>ID</th> */}
        <th>Username</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user => (
        <tr key={user.id}>
          {/* Table data */}
          {/* <td>{user.id}</td> */}
          <td>{user.username}</td>
          <td>{user.is_active ? 'Active' : 'Inactive'}</td>
          <td>
            <button onClick={() => deactivateUser(user.id)}>Deactivate</button>
            <button onClick={() => updateUser(user)}>Update</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      

      

      <div className="user-form">
        {/* Add New User button */}
        {!showUpdateModal && !selectedUser && (
          <button onClick={handleAddNewUser}>Add New User</button>
        )}

        {/* Update user modal */}
        {showUpdateModal && (
          <div className="update-modal">
            <form onSubmit={handleSubmit}>
              
              <input
                type="text"
                placeholder="UserName"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <input
                type="boolean"
                placeholder="is_active"
                value={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.value })}
             />
            
              {/* Submit button */}
              <button type="submit">Submit</button>
            </form>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;










