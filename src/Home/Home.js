import React, { useEffect, useState } from 'react';
import './Home.css';

function Home() {
  const [timeCycles, setTimeCycles] = useState([]);
  const [selectedTimeCycle, setSelectedTimeCycle] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [user, setUser] = useState('');

  useEffect(() => {
    // Fetch the active time cycle from Django backend API
    fetch('http://127.0.0.1:8000/api/active-time-cycle/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSelectedTimeCycle(data); // Set the active time cycle immediately
      })
      .catch((error) => console.error('Error fetching active time cycle:', error));

    // Fetch user details for welcome message
    fetch('http://127.0.0.1:8000/api/user/login/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then((response) => response.json())
      .then((userData) => {
        setUser(userData.username); // Set the username to display the welcome message
      })
      .catch((error) => console.error('Error fetching user details:', error));
  }, []);


  // useEffect(() => {
  //   // Fetch the active time cycle from Django backend API
  //   fetch('http://127.0.0.1:8000/api/active-time-cycle/', {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setSelectedTimeCycle(data); // Set the active time cycle immediately
  //     })
  //     .catch((error) => console.error('Error fetching active time cycle:', error));
  // }, []);

   

  useEffect(() => {
    if (selectedTimeCycle) {
      // Fetch allocation data for the selected time cycle from Django backend API
      fetch(`http://127.0.0.1:8000/api/allocations/${selectedTimeCycle.id}/`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setAllocations(data))
        
        .catch((error) => console.error('Error fetching allocation data:', error));
    }
  }, [selectedTimeCycle]);

  const renderTable = () => {
    // Render AllocationTable only if a time cycle is selected and allocations exist
    if (!selectedTimeCycle || allocations.length === 0) {
      return <div>No active time cycle found or no allocations available.</div>;
    }

    return (
      <table className="centered-table">
         <thead>
            <tr>
            <th>Employee</th>
           
       {allocations.length > 0 &&
        allocations[0].days.map((dayAllocation, index) => (
           <th key={index}>{dayAllocation.date}</th>
         ))}
            </tr>
          </thead>
          <tbody>
            {allocations.map((allocation) => (
              <tr key={allocation.employee.id}>
                <td>{allocation.employee.name}</td>
                {allocation.days.map((dayAllocation) => (
                  <td
                  key={dayAllocation.date}
                  style={{ backgroundColor: dayAllocation.task ? 'green' : 'red' }}
                  >
                   {dayAllocation.task ? 'Task Added' : 'No Task'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
       </table>
    );
  };

  return (
    
    <div className='allocation-container'>
      <h1 className='welcome-message'>Welcome, {user}!</h1>
      <div className='allocation-table'>
      
      <h2>Allocation Table</h2>
      {renderTable()}
      </div>
    </div>
  );
}

export default Home;


















