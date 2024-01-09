
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './AllocationTable.css';

function AllocationTable() {
  const [timeCycles, setTimeCycles] = useState([]);
  const [selectedTimeCycle, setSelectedTimeCycle] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const [allocationDate, setAllocationDate] = useState('');
  const [task, setTask] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [offDays, setOffDays] = useState([]);
  const [selectedOffDay, setSelectedOffDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showOffDays, setShowOffDays] = useState(false);
  
 
  useEffect(() => {
    // Fetch list of time cycles from Django backend API
    fetch('http://127.0.0.1:8000/api/time-cycle/',{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setTimeCycles(data))
      .catch((error) => console.error('Error fetching time cycles:', error));
  }, []);

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

  useEffect(() => {
    // Fetch list of off days from Django backend API
    fetch('http://127.0.0.1:8000/api/offdays/',{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
        .then((response) => response.json())
        .then((data) => setOffDays(data))
        .catch((error) => console.error('Error fetching off days:', error));
}, []);

  const handleCreateAllocation = () => {
    if (selectedTimeCycle) {
      fetch(`http://127.0.0.1:8000/api/timecycle/${selectedTimeCycle.id}/allocate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(/* Data for creating allocation */),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle successful creation
          console.log('Allocation created:', data);
          
        })
        .catch((error) => console.error('Error creating allocation:', error));
    }
  };

  const handleAddAllocation = () => {
    setShowAddModal(true);
  };

  const handleDeleteAllocation = () => {
    setShowDeleteModal(true);
  };

  const handleAddModalSubmit = (e) => {
    e.preventDefault();
    const requestBody = {
      employee_name: employeeName,
      allocation_date: allocationDate,
      task: task,
    };
  
    fetch('http://127.0.0.1:8000/api/allocation/add/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Allocation added successfully.');
          setShowAddModal(false);
  
          // Fetch updated allocations for the selected time cycle
          fetch(`http://127.0.0.1:8000/api/allocations/${selectedTimeCycle.id}/`,{
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          })
            .then((response) => response.json())
            .then((data) => setAllocations(data))
            .catch((error) => console.error('Error fetching allocation data:', error));
        } else {
          console.error('Failed to add allocation.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleDeleteModalSubmit = (e) => {
    e.preventDefault();
    const requestBody = {
      employee_name: employeeName,
      allocation_date: allocationDate,
    };
  
    fetch('http://127.0.0.1:8000/api/allocation/remove/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Allocation deleted successfully.');
          setShowDeleteModal(false);
  
          // Fetch updated allocations for the selected time cycle
          fetch(`http://127.0.0.1:8000/api/allocations/${selectedTimeCycle.id}/`,{
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          })
            .then((response) => response.json())
            .then((data) => setAllocations(data))
            .catch((error) => console.error('Error fetching allocation data:', error));
        } else {
          console.error('Failed to delete allocation.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  
  
  const handleDeleteOffDay = (offDayId) => {
    fetch(`http://127.0.0.1:8000/api/offdays/${offDayId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log('Off day deleted successfully.');
          // Fetch updated allocations for the selected time cycle
          fetch(`http://127.0.0.1:8000/api/allocations/${selectedTimeCycle.id}/`,{
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          })
            .then((response) => response.json())
            .then((data) => setAllocations(data))
            .catch((error) => console.error('Error fetching allocation data:', error));
          // Update the offDays list after successful deletion
          // Fetch updated off days
          fetch('http://127.0.0.1:8000/api/offdays/',{
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          })
            .then((response) => response.json())
            .then((data) => setOffDays(data))
            .catch((error) =>
              console.error('Error fetching off days:', error)
            );
        } else {
          console.error('Failed to delete off day.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  
  

const handleListOffDays = () => {
  // Toggle the state to show/hide off days
  setShowOffDays(!showOffDays);
};

const renderOffDaysButton = () => {
  return (
    <Button onClick={handleListOffDays}>
      {showOffDays ? 'Hide Off Days' : 'List Off Days'}
    </Button>
  );
};

const renderOffDayList = () => {
  if (!Array.isArray(offDays)) {
    return <div>No off days available to display.</div>;
  }
  if (showOffDays) {
    return (
      <div>
        <h1>Off Days List</h1>
        <ul>
          {/* Iterate through offDays when showOffDays is true */}
          {offDays.map((offDay) => (
            <li key={offDay.id}>
              {offDay.date}
              <Button
                variant="danger"
                onClick={() => handleDeleteOffDay(offDay.id)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null; // Render nothing if showOffDays is false
};

  const handleAddOffDay = () => {
    if (selectedDate) {
      const newOffDayData = {
        date: selectedDate,
        
      };

      fetch('http://127.0.0.1:8000/api/offdays/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(newOffDayData),
      })
        .then((response) => {
          if (response.ok) {
            console.log('Off day added successfully.');
            setShowModal(false);
            // Fetch updated allocations for the selected time cycle
          fetch(`http://127.0.0.1:8000/api/allocations/${selectedTimeCycle.id}/`,{
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          })
          .then((response) => response.json())
          .then((data) => setAllocations(data))
          .catch((error) => console.error('Error fetching allocation data:', error));

            // Fetch updated off days
            fetch('http://127.0.0.1:8000/api/offdays/',{
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            })
              .then((response) => response.json())
              .then((data) => setOffDays(data))
              .catch((error) =>
                console.error('Error fetching off days:', error)
              );
          } else {
            console.error('Failed to add off day.');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          setShowModal(false);
        });
    } else {
      console.error('Please select a date for the new off day.');
    }
  };
  


  const handleViewAllocations = (timeCycle) => {
    setSelectedTimeCycle(timeCycle);
  };
  const renderTimeCycleList = () => {
    if (!Array.isArray(timeCycles)) {
      return <div>No time cycles available.</div>;
    }
  
    
    return (
      <div>
      <table className="timecycle-table">
        <tbody>
          {timeCycles.map((timeCycle) => (
            <tr key={timeCycle.id}>
              <td>
                <strong>{timeCycle.time_cycle_name}</strong><br />
                {timeCycle.start_date} to {timeCycle.end_date}
              </td>
              <td>
                <Button variant="primary" onClick={() => handleViewAllocations(timeCycle)} style={{ marginRight: '10px' }}>
                  View Allocation Table
                </Button>
                <Button variant="success" onClick={() => handleCreateAllocation(timeCycle)}>
                  Create Allocation Table
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
      
    );
  };

  const renderTable = () => {
    // Render AllocationTable only if a time cycle is selected and allocations exist
    if (!selectedTimeCycle || allocations.length === 0) {
      return <div>Select a time cycle to view allocations.</div>;
    }

  

    return (
      <table>
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
        <td style={{ backgroundColor: allocation.employee.is_active ? 'inherit' : 'blue' }}>
          {allocation.employee.name}
        </td>
        {allocation.days.map((dayAllocation) => (
          <td
            key={dayAllocation.date}
            style={{
              backgroundColor: dayAllocation.task ? 'green' : 'red',
            }}
          >
            {dayAllocation.task ? 'Task Added' : 'No Task'}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
         
         {/* <tbody>
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
         </tbody> */}
      </table>
    );
  };

  return (
    <div className='allocation-container'>
      <h1>Time Cycle List</h1>
      <div className='time-cycle-list'>{renderTimeCycleList()}</div>
      <div className='allocation-table'>
        <h1>Allocation Table</h1>
      {renderTable()}
      <div className='allocation-buttons'>
        {/* Button to open Add Allocation modal */}
      <Button variant="success" onClick={handleAddAllocation}>Add Allocation</Button>

{/* Button to open Delete Allocation modal */}
<Button variant="danger" onClick={handleDeleteAllocation}>Delete Allocation</Button>
      </div>

      {/* Add Allocation Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Allocation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddModalSubmit}>
              <Form.Group controlId="employeeName">
                <Form.Label>Employee Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="allocationDate">
                <Form.Label>Allocation Date:</Form.Label>
                <Form.Control
                  type="date"
                  value={allocationDate}
                  onChange={(e) => setAllocationDate(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="task">
                <Form.Label>Task:</Form.Label>
                <Form.Control
                  type="text"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      
      

      {/* Delete Allocation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Allocation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleDeleteModalSubmit}>
              <Form.Group controlId="employeeName">
                <Form.Label>Employee Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="allocationDate">
                <Form.Label>Allocation Date:</Form.Label>
                <Form.Control
                  type="date"
                  value={allocationDate}
                  onChange={(e) => setAllocationDate(e.target.value)}
                />
              </Form.Group>
              <Button variant="danger" type="submit">
                Delete
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      
      
      </div>
      <div className='off-days-section'>
      {renderOffDaysButton()} {/* Display the List/Hide Off Days button */}
      {renderOffDayList()} {/* Render the off day list based on state */}
        
        <div className='add-off-day-section'>
        
        <Button onClick={() => setShowModal(true)}>Add off day</Button>

        {/* Modal for selecting date */}
        <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Select Off Day Date</h5>
                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="offDayDate" className="form-label">Select Date:</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="offDayDate"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={handleAddOffDay}>Add Off Day</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    </div>
  );
}

export default AllocationTable;





















