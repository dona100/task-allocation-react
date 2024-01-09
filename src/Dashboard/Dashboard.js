import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar'; // Import your Navbar component
import './Dashboard.css';
import Home from '../Home/Home';
import User from '../User/User';
import UserRole from '../UserRole/UserRole';
import Permissions from '../Permissions/Permissions';
import Employee from '../Employee/Employee';
import AllocationTable from '../Allocation/AllocationTable';
import TimeCycle from '../TimeCycle/TimeCycle';

const Dashboard = () => {

  const [route, setRoute] = useState('home');

  const handleRouteChange = (newRoute) => {
    setRoute(newRoute);
  };

  const handleLogout = () => {
    // Handle logout functionality 
    localStorage.removeItem('token');
    // Redirect  upon logout
    
    window.location.href = '/login';
    // history.push('/login');
  };
  let content;
  switch (route) {
    case 'home':
      content = <Home />;
      break;
    case 'user':
      content = <User />;
      break;
    case 'userrole':
      content = <UserRole />;
      break;
    case 'permissions':
      content = <Permissions />;
      break;
    case 'employee':
      content = <Employee />;
      break;
    case 'timecycle':
      content = <TimeCycle />;
      break;
    case 'allocationtable':
      content = <AllocationTable />;
      break;
  

    default:
      content = <Home />;
  }
    
    return (
      <div className='dashboard-content'>
         <Navbar handleLogout={handleLogout} handleRouteChange={handleRouteChange} />
         {content}
        
      </div>
    );
  };
  
  export default Dashboard;