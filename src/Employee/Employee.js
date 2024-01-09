import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import './Employee.css';

const EmployeeComponent = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    employee_name: '',
    email: '',
    contact_no: '',
    address: '',
    designation: '',
    is_active: ''
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showEmployeeDetailsModal, setShowEmployeeDetailsModal] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/employees/all/',{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const createEmployee = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/employees/', newEmployee,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setNewEmployee({
        employee_name: '',
        email: '',
        contact_no: '',
        address: '',
        designation: '',
        is_active: ''
      });
      setShowAddModal(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  const deleteEmployee = async (employeeId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/employees/${employeeId}/`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const updateEmployee = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/employees/${selectedEmployee.id}/`, selectedEmployee,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setShowUpdateModal(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const viewEmployeeDetails = async (employeeId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/employees/${employeeId}/`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setSelectedEmployee(response.data);
      setShowEmployeeDetailsModal(true);
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  };

  const editEmployee = () => {
    setShowEmployeeDetailsModal(false);
    setShowUpdateModal(true);
  };

  return (
    <div className="employee-container" >
      {/* Add New Employee Button */}
      <Button className="add-employee-button" variant="primary" onClick={() => setShowAddModal(true)}>
        Add Employee
      </Button>

      {/* Add New Employee Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
      <Modal.Header closeButton>
    <Modal.Title>Add New Employee</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="formEmployeeName">
        <Form.Label>Employee Name</Form.Label>
        <Form.Control
          type="text"
          value={newEmployee.employee_name}
          onChange={(e) => setNewEmployee({ ...newEmployee, employee_name: e.target.value })}
          placeholder="Enter employee name"
        />
      </Form.Group>
     
      <Form.Group controlId="formEmployeeEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={newEmployee.email}
          onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
          placeholder="Enter email"
        />
      </Form.Group>
      <Form.Group controlId="formEmployeeContactno">
        <Form.Label>Contact_no</Form.Label>
        <Form.Control
          type="text"
          value={newEmployee.contact_no}
          onChange={(e) => setNewEmployee({ ...newEmployee, contact_no: e.target.value })}
          placeholder="Enter contact-no"
        />
      </Form.Group>
      <Form.Group controlId="formEmployeeAddress">
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          value={newEmployee.address}
          onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
          placeholder="Enter address"
        />
      </Form.Group>
      <Form.Group controlId="formEmployeeDesignation">
        <Form.Label>Designation</Form.Label>
        <Form.Control
          type="text"
          value={newEmployee.designation}
          onChange={(e) => setNewEmployee({ ...newEmployee, designation: e.target.value })}
          placeholder="Enter designation"
        />
      </Form.Group>
      <Form.Group controlId="formEmployeeIsActive">
        <Form.Label>IsActive</Form.Label>
        <Form.Control
          type="boolean"
          value={newEmployee.is_active}
          onChange={(e) => setNewEmployee({ ...newEmployee, is_active: e.target.value })}
          placeholder="Enter active status"
        />
      </Form.Group>
      
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
      Close
    </Button>
    <Button variant="primary" onClick={createEmployee}>
      Add Employee
    </Button>
  </Modal.Footer>
      </Modal>

      {/* Employee List */}
      <div>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr className="employee-row" key={employee.id}>
              <td>{employee.employee_name}</td>
              <td>
                <Button variant="outline-info" onClick={() => viewEmployeeDetails(employee.id)}>
                  View Details
                </Button>
                <Button variant="outline-danger" onClick={() => deleteEmployee(employee.id)}>
                  Deactivate
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
      

      {/* Employee Details Modal */}
      <Modal show={showEmployeeDetailsModal} onHide={() => setShowEmployeeDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Employee Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Name: {selectedEmployee?.employee_name}</p>
          <p>Email: {selectedEmployee?.email}</p>
          <p>Contact No: {selectedEmployee?.contact_no}</p>
          <p>Address: {selectedEmployee?.address}</p>
          <p>Designation: {selectedEmployee?.designation}</p>
          <p>Active: {selectedEmployee && selectedEmployee.is_active ? 'Active' : 'Inactive'}</p>

          
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEmployeeDetailsModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={editEmployee}>
            Edit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Employee Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
      <Modal.Header closeButton>
    <Modal.Title>Update Employee</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="formEmployeeName">
        <Form.Label>Employee Name</Form.Label>
        <Form.Control
          type="text"
          value={selectedEmployee?.employee_name || ''}
          onChange={(e) => setSelectedEmployee({ ...selectedEmployee, employee_name: e.target.value })}
          placeholder="Enter employee name"
        />
      </Form.Group>
     
      <Form.Group controlId="formEmployeeEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={selectedEmployee?.email || ''}
          onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
          placeholder="Enter email"
        />
      </Form.Group>
      <Form.Group controlId="formEmployeeContactno">
        <Form.Label>Contact_no</Form.Label>
        <Form.Control
          type="text"
          value={selectedEmployee?.contact_no || ''}
          onChange={(e) => setSelectedEmployee({ ...selectedEmployee, contact_no: e.target.value })}
          placeholder="Enter employee contact no"
        />
      </Form.Group>
      <Form.Group controlId="formEmployeeAddress">
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          value={selectedEmployee?.address || ''}
          onChange={(e) => setSelectedEmployee({ ...selectedEmployee, address: e.target.value })}
          placeholder="Enter employee address"
        />
      </Form.Group>
      <Form.Group controlId="formEmployeeDesignation">
        <Form.Label>Designation</Form.Label>
        <Form.Control
          type="text"
          value={selectedEmployee?.designation || ''}
          onChange={(e) => setSelectedEmployee({ ...selectedEmployee, designation: e.target.value })}
          placeholder="Enter employee designation"
        />
      </Form.Group>
      <Form.Group controlId="formEmployeeStatus">
  <Form.Check
    type="checkbox"
    label="Is Active"
    checked={selectedEmployee?.is_active}
    onChange={(e) =>
      setSelectedEmployee({ ...selectedEmployee, is_active: e.target.checked })
    }
  />
</Form.Group>

 
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
      Close
    </Button>
    <Button variant="primary" onClick={updateEmployee}>
      Update Employee
    </Button>
  </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeComponent;








