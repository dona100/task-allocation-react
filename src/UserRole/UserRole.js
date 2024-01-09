


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserRole.css';

const UserRoleComponent = () => {
  const [userRoles, setUserRoles] = useState([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [usersInRole, setUsersInRole] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [selectedUserRole, setSelectedUserRole] = useState(null);

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/user-roles/all/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setUserRoles(response.data);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  const handleRoleSelection = async (roleId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/user-roles/${roleId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setUsersInRole(response.data);
      setSelectedRole(roleId);
      // Set the selected user role
      const selectedRole = userRoles.find(role => role.id === roleId);
      setSelectedUserRole(selectedRole);
    } catch (error) {
      console.error('Error fetching users in role:', error);
    }
  };

  const handleAddUserRole = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/user-roles/create/',
        { name: newRoleName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      setUserRoles([...userRoles, response.data]);
      setNewRoleName('');
      // Fetch user roles again to update the list
      fetchUserRoles();
    } catch (error) {
      console.error('Error creating user role:', error);
    }
  };

  const handleAddUserToRole = async () => {
    try {
      const availableUsersResponse = await axios.get('http://127.0.0.1:8000/api/users/all/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setAvailableUsers(availableUsersResponse.data);
      //  Show the add user form after fetching available users
       setShowAddUserForm(true);
      await axios.put(
        `http://127.0.0.1:8000/api/user-to-userrole/${selectedUser}/${selectedRole}/`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      // Refresh users in the selected role
      handleRoleSelection(selectedRole);
    } catch (error) {
      console.error('Error adding user to role:', error);
    }
  };

  const handleRemoveUserFromRole = async (userId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/user-to-userrole/${userId}/${selectedRole}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      // Refresh users in the selected role
      handleRoleSelection(selectedRole);
    } catch (error) {
      console.error('Error removing user from role:', error);
    }
  };

  return (
    <div className='container'>
      {/* Form to add new user role */}
      <input 
        type="text"
        placeholder="New Role Name"
        value={newRoleName}
        onChange={(e) => setNewRoleName(e.target.value)}
      />
      <button onClick={handleAddUserRole}>Add User Role</button>

      {/* List of user roles */}
      <div className="user-role-list">
  <h5>User Role List</h5>
  <table className="role-table">
    <thead>
      <tr>
        <th>Role Name</th>
      </tr>
    </thead>
    <tbody>
      {userRoles.map(role => (
        <tr key={role.id} onClick={() => handleRoleSelection(role.id)}>
          <td>{role.name}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      

      {/* Display selected user role name */}
      {selectedUserRole && (
        <div>
          <h5>Users in {selectedUserRole.name}</h5>
        </div>
      )}

      {/* List of users in selected role */}
      {selectedRole && (
        <ul>
          {usersInRole.map((user) => (
            <li key={user.id}>
              {user.username}
              <button onClick={() => handleRemoveUserFromRole(user.id)}>
                Remove User
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Form to add user to selected role */}

      {selectedRole && (
        <div>
          <button onClick={handleAddUserToRole}>Add User to Role</button>
          
          {/* Display the form only when showAddUserForm is true */}
          {showAddUserForm && (
            <div>
              {/* New dropdown for available users */}
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Select User</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
              {/* <button onClick={handleAddUserToRole}>Add User to Role</button> */}
            </div>
          )}
        </div>
      )}
      
      
    </div>
  );
};

export default UserRoleComponent;
