import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Permissions.css';

const Permissions = () => {
  const [employeePermissions, setEmployeePermissions] = useState([]);
  const [timeCyclePermissions, setTimeCyclePermissions] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [showUserRoleDropdown, setShowUserRoleDropdown] = useState(false);
  const [selectedUserRole, setSelectedUserRole] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [rolePermissions, setRolePermissions] = useState([]);

  useEffect(() => {
    
    fetchEmployeePermissions();
    fetchTimeCyclePermissions();
    fetchUserRoles();
    
  }, []);

  const fetchEmployeePermissions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/employee-permissions/',{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setEmployeePermissions(response.data.employee_permissions);
    } catch (error) {
      console.error('Error fetching employee permissions:', error);
    }
  };

  const fetchTimeCyclePermissions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/timecycle-permissions/',{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setTimeCyclePermissions(response.data.time_cycle_permissions);
    } catch (error) {
      console.error('Error fetching time cycle permissions:', error);
    }
  };

  const fetchUserRoles = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/user-roles/all/',{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setUserRoles(response.data);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  const fetchRolePermissions = async (groupPk) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/userrole-permission/${groupPk}/`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setRolePermissions(response.data); // Assuming the API response contains role permissions
    } catch (error) {
      console.error('Error fetching role permissions:', error);
    }
  };

  const handleUserRoleSelection = (groupPk,roleName) => {
    setSelectedUserRole(roleName);
    fetchRolePermissions(groupPk); // Fetch permissions for the selected user role
  };

  const handleAddPermission = async (permissionId, userRoleId) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/userrole-permission/${userRoleId}/${permissionId}/`,
        null, // pass null as the second argument if there's no data payload
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      // After adding permission, refresh role permissions for the selected user role
      fetchRolePermissions(userRoleId);
      fetchEmployeePermissions();
      fetchTimeCyclePermissions();
      // fetchUserRoles();
    } catch (error) {
      console.error('Error adding permission to user role:', error);
    }
  };



  

  const handleDeletePermission = async (permissionId, userRoleId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/userrole-permission/${userRoleId}/${permissionId}/`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      // After deleting permission, refresh role permissions for the selected user role
      fetchRolePermissions(userRoleId);
      fetchEmployeePermissions();
      fetchTimeCyclePermissions();
      // fetchUserRoles();
    } catch (error) {
      console.error('Error deleting permission from user role:', error);
    }
  };

  const handleAddButtonClick = (permission) => {
    setSelectedPermission(permission);
    setShowUserRoleDropdown(true);
    setShowAddForm(!showAddForm);
    setShowDeleteForm(false);
  };

  const handleDeleteButtonClick = (permission) => {
    setSelectedPermission(permission);
    setShowUserRoleDropdown(true);
    setShowDeleteForm(!showDeleteForm);
    setShowAddForm(false);
  };

  return (
    <div className='permissions-container'>
      <div className="user-role-permissions">
  <h2>User Roles</h2>
  <table className="role-table">
    <thead>
      <tr>
        <th>Role Name</th>
      </tr>
    </thead>
    <tbody>
      {userRoles.map(role => (
        <tr key={role.id}>
          <td>
            <button onClick={() => handleUserRoleSelection(role.id, role.name)}>
              {role.name}
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {selectedUserRole && (
    <div className="role-permissions">
      <h3>{`Permissions for ${selectedUserRole}`}</h3>
      <table className="permission-table">
        <thead>
          <tr>
            <th>Codename</th>
            <th>Permission</th>
          </tr>
        </thead>
        <tbody>
          {rolePermissions.map(permission => (
            <tr key={permission.id}>
              <td>{permission.codename}</td>
              <td>{permission.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
      {/* Employee Permissions */}
      <div>
      <h2>Employee Permissions</h2>
      <table className="permissions-table">
        <thead>
          <tr>
            <th>Permission</th>
            <th>Add</th>
            <th>Delete</th>
            <th>Add Role</th>
            <th>Delete Role</th>
          </tr>
        </thead>
        <tbody>
          {employeePermissions.map((permission) => (
            <tr key={permission.id} className="permission-item">
              <td>
                {permission.codename} - {permission.name}
              </td>
              <td>
                <button onClick={() => handleAddButtonClick(permission)}>Add</button>
              </td>
              <td>
                <button onClick={() => handleDeleteButtonClick(permission)}>Delete</button>
              </td>
              <td>
                {showAddForm && selectedPermission?.id === permission.id && (
                  <select onChange={(e) => handleAddPermission(permission.id, e.target.value)}>
                    <option value="">Select User Role</option>
                    {userRoles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                )}
              </td>
              <td>
                {showDeleteForm && selectedPermission?.id === permission.id && (
                  <select onChange={(e) => handleDeletePermission(permission.id, e.target.value)}>
                    <option value="">Select User Role</option>
                    {userRoles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

      {/* Time Cycle Permissions */}
      <div>
      <h2>Time Cycle Permissions</h2>
      <table className="permissions-table">
        <thead>
          <tr>
            <th>Permission</th>
            <th>Add</th>
            <th>Delete</th>
            <th>Add Role</th>
            <th>Delete Role</th>
          </tr>
        </thead>
        <tbody>
          {timeCyclePermissions.map((permission) => (
            <tr key={permission.id} className="permission-item">
              <td>
                {permission.codename} - {permission.name}
              </td>
              <td>
                <button onClick={() => handleAddButtonClick(permission)}>Add</button>
              </td>
              <td>
                <button onClick={() => handleDeleteButtonClick(permission)}>Delete</button>
              </td>
              <td>
                {showAddForm && selectedPermission?.id === permission.id && (
                  <select onChange={(e) => handleAddPermission(permission.id, e.target.value)}>
                    <option value="">Select User Role</option>
                    {userRoles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                )}
              </td>
              <td>
                {showDeleteForm && selectedPermission?.id === permission.id && (
                  <select onChange={(e) => handleDeletePermission(permission.id, e.target.value)}>
                    <option value="">Select User Role</option>
                    {userRoles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default Permissions;




















