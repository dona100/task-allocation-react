
import React from 'react';
import './Navbar.css'; // Import your CSS file for Navbar styling



const Navbar = ({handleRouteChange,handleLogout}) => {

  
  return (

    <nav className="navbar">
      
      <button onClick={() => handleRouteChange('home')}>Home</button>
      <button onClick={() => handleRouteChange('user')}>User</button>
      <button onClick={() => handleRouteChange('userrole')}>UserRole</button>
      <button onClick={() => handleRouteChange('permissions')}>Permissions</button>
      <button onClick={() => handleRouteChange('employee')}>Employee</button>
      <button onClick={() => handleRouteChange('timecycle')}>TimeCycle</button>
      <button onClick={() => handleRouteChange('allocationtable')}>AllocationTable</button>
      <button onClick={handleLogout}>Logout</button>
    </nav>
    
  );
};

export default Navbar;
