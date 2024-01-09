import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import './TimeCycle.css';

const TimeCycle = () => {
  const [timeCycles, setTimeCycles] = useState([]);
  const [newTimeCycle, setNewTimeCycle] = useState({
    time_cycle_name: '',
    start_date: '',
    end_date: '',
    is_active: ''
    
  });
  const [selectedTimeCycle, setSelectedTimeCycle] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showTimeCycleDetailsModal, setShowTimeCycleDetailsModal] = useState(false);

  useEffect(() => {
    fetchTimeCycles();
  }, []);

  const fetchTimeCycles = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/time-cycle/',{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setTimeCycles(response.data);
    } catch (error) {
      console.error('Error fetching time-cycles:', error);
    }
  };

  const createTimeCycle = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/time-cycle/', newTimeCycle,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setNewTimeCycle({
        time_cycle_name: '',
        start_date: '',
        end_date: '',
        is_active: ''
      });
      setShowAddModal(false);
      fetchTimeCycles();
    } catch (error) {
      console.error('Error creating time-cycle:', error);
    }
  };

  const deleteTimeCycle = async (timecycleId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/time-cycle/${timecycleId}/`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      fetchTimeCycles();
    } catch (error) {
      console.error('Error deleting time-cycle:', error);
    }
  };

  const updateTimeCycle = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/time-cycle/${selectedTimeCycle.id}/`, selectedTimeCycle,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setShowUpdateModal(false);
      fetchTimeCycles();
    } catch (error) {
      console.error('Error updating time-cycle:', error);
    }
  };

  const viewTimeCycleDetails = async (timecycleId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/time-cycle/${timecycleId}/`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setSelectedTimeCycle(response.data);
      setShowTimeCycleDetailsModal(true);
    } catch (error) {
      console.error('Error fetching time-cycle details:', error);
    }
  };

  const editTimeCycle = () => {
    setShowTimeCycleDetailsModal(false);
    setShowUpdateModal(true);
  };

  return (
    <div className='timecycle-container'>
      {/* Add New time-cycle Button */}
      <Button className='add-timecycle-button' variant="primary" onClick={() => setShowAddModal(true)}>
        Add TimeCycle
      </Button>

      {/* Add New time-cycle Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
      <Modal.Header closeButton>
    <Modal.Title>Add New TimeCycle</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="formTimeCycleName">
        <Form.Label>TimeCycle Name</Form.Label>
        <Form.Control
          type="text"
          value={newTimeCycle.time_cycle_name}
          onChange={(e) => setNewTimeCycle({ ...newTimeCycle, time_cycle_name: e.target.value })}
          placeholder="Enter TimeCycle name"
        />
      </Form.Group>
      {/* Other form inputs */}
      <Form.Group controlId="formStartDate">
        <Form.Label>Start Date</Form.Label>
        <Form.Control
          type="date"
          value={newTimeCycle.start_date}
          onChange={(e) => setNewTimeCycle({ ...newTimeCycle, start_date: e.target.value })}
          placeholder="Enter startdate"
        />
      </Form.Group>
      <Form.Group controlId="formEndDate">
        <Form.Label>End Date</Form.Label>
        <Form.Control
          type="date"
          value={newTimeCycle.end_date}
          onChange={(e) => setNewTimeCycle({ ...newTimeCycle, end_date: e.target.value })}
          placeholder="Enter enddate"
        />
      </Form.Group>
      <Form.Group controlId="formIsactive">
        <Form.Label>IsActive</Form.Label>
        <Form.Control
          type="boolean"
          value={newTimeCycle.is_active}
          onChange={(e) => setNewTimeCycle({ ...newTimeCycle, is_active: e.target.value })}
          placeholder="Enter active status"
        />
      </Form.Group>
      
      
      
      
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
      Close
    </Button>
    <Button variant="primary" onClick={createTimeCycle}>
      Add TimeCycle
    </Button>
  </Modal.Footer>
      </Modal>

      {/* time-cycle List */}
      <div>
      <table className='timecycle-table'>
        <thead>
          <tr>
            <th>Time Cycle Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {timeCycles.map((timeCycle) => (
            <tr className='timecycle-row' key={timeCycle.id}>
              <td>{timeCycle.time_cycle_name}</td>
              <td>{timeCycle.start_date}</td>
              <td>{timeCycle.end_date}</td>
              <td>
                <Button variant="outline-info" onClick={() => viewTimeCycleDetails(timeCycle.id)}>
                  View Details
                </Button>
                <Button variant="outline-danger" onClick={() => deleteTimeCycle(timeCycle.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
      

      {/* time-cycle Details Modal */}
      <Modal show={showTimeCycleDetailsModal} onHide={() => setShowTimeCycleDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>TimeCycle Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Name: {selectedTimeCycle?.time_cycle_name}</p>
          <p>Start Date: {selectedTimeCycle?.start_date}</p>
          <p>End Date: {selectedTimeCycle?.end_date}</p>
          
          <p>Active: {selectedTimeCycle && selectedTimeCycle.is_active ? 'Active' : 'Inactive'}</p>

          
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTimeCycleDetailsModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={editTimeCycle}>
            Edit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update time-cycle Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
      <Modal.Header closeButton>
    <Modal.Title>Update TimeCycle</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="formTimeCycleName">
        <Form.Label>TimeCycle Name</Form.Label>
        <Form.Control
          type="text"
          value={selectedTimeCycle?.time_cycle_name || ''}
          onChange={(e) => setSelectedTimeCycle({ ...selectedTimeCycle, time_cycle_name: e.target.value })}
          placeholder="Enter TimeCycle name"
        />
      </Form.Group>
      
      <Form.Group controlId="formstartdate">
        <Form.Label>Start Date</Form.Label>
        <Form.Control
          type="date"
          value={selectedTimeCycle?.start_date || ''}
          onChange={(e) => setSelectedTimeCycle({ ...selectedTimeCycle, start_date: e.target.value })}
          placeholder="Enter start date"
        />
      </Form.Group>
      <Form.Group controlId="formenddate">
        <Form.Label>End Date</Form.Label>
        <Form.Control
          type="date"
          value={selectedTimeCycle?.end_date || ''}
          onChange={(e) => setSelectedTimeCycle({ ...selectedTimeCycle, end_date: e.target.value })}
          placeholder="Enter end date"
        />
      </Form.Group>
      
      
      <Form.Group controlId="formTimeCycleStatus">
  <Form.Check
    type="checkbox"
    label="Is Active"
    checked={selectedTimeCycle?.is_active}
    onChange={(e) =>
      setSelectedTimeCycle({ ...selectedTimeCycle, is_active: e.target.checked })
    }
  />
</Form.Group>

 
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
      Close
    </Button>
    <Button variant="primary" onClick={updateTimeCycle}>
      Update TimeCycle
    </Button>
  </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TimeCycle;








