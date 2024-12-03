// src/components/UnauthorizedUserGrid.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UnauthorizedUserGrid = () => {
  const [unauthorizedUsers, setUnauthorizedUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);

  useEffect(() => {
    // Fetch unauthorized users from the backend or your data source
    // Replace this with the actual API endpoint for fetching unauthorized users
    axios.get('https://main.dwoh96qwfxa1j.amplifyapp.com/inventory/getallnonverifiedsupplier')
      .then(response => setUnauthorizedUsers(response.data))
      .catch(error => console.error('Error fetching unauthorized users:', error));
  }, []);

  const handleApproveClick = (username) => {
    // Make an API call to update the approval status
    axios.put(`https://main.dwoh96qwfxa1j.amplifyapp.com/user/grantaccess?&requestId=${username}`)
      .then(response => {
        // Update the local state with the updated user data
        setApprovedUsers([...approvedUsers, username]);
      })
      .catch(error => console.error('Error updating approval status:', error));
  };

  return (
    <div>
      <h2>Unauthorized Suppliers</h2>
      <div className="card-grid">
        {unauthorizedUsers.map(user => (
          <div key={user.username} className="card">
            <h3>{user.username}</h3>
            <p>Name: {user.name}</p>
            <p>Contact: {user.contact}</p>
            <p>Email: {user.supplierID}</p>
            <button
              className={`UnauthorizedSupplierApproveButton ${approvedUsers.includes(user.supplierID) ? 'done' : ''}`}
              onClick={() => handleApproveClick(user.supplierID)}
              disabled={approvedUsers.includes(user.supplierID)}
            >
              {approvedUsers.includes(user.supplierID) ? 'Done' : 'Approve'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnauthorizedUserGrid;
