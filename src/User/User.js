import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
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
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Retrieve the access token from local storage
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
  const handleAddNewAdminUser = () => {
    setShowAddModal(true); // Show the add admin user modal
    setFormData({ /* Reset form fields */ });
    setSelectedUser(null);
  };

  const handleSubmitAddAdminUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/admin/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setFormData({ /* Reset form fields */ });
      fetchUsers();
      setShowAddModal(false); // Close the add admin user modal after submission
      setSelectedUser(null); // Reset selected user
    } catch (error) {
      console.error('Error adding admin user:', error);
    }
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
        <div className="button-space">
          {/* Add New Admin User button using React Bootstrap */}
        {!showUpdateModal && !selectedUser && (
          <Button variant="primary" onClick={handleAddNewAdminUser}>
            Add New Admin User
          </Button>
        )}
        </div>
        


        {/* Update user modal */}
        {showUpdateModal && (
          <Modal show={showUpdateModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title> User Detail</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                {/* Input fields for updating user details */}
                {/* Populate form fields with user data */}
                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formIsActive">
                  <Form.Check
                    type="checkbox"
                    label="Active"
                    checked={formData.is_active} // Set the checked state based on formData.is_active
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        {/* Add admin user modal using React Bootstrap */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Admin User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmitAddAdminUser}>
              {/* Input fields for adding admin user details */}
              <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formIsStaff">
                <Form.Check
                  type="checkbox"
                  label="Admin User"
                  checked={true} // Set is_staff to true for admin user
                  onChange={(e) => setFormData({ ...formData, is_staff: e.target.checked })}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Add Admin User
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default User;








