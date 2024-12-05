// src/components/UserGrid.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import userData from '../../sampledata/users.json';
import './Grid.css'; // Import a common CSS file for styling

const UserGrid = () => {
  const [users, setUsers] = useState([]);
  const [editableUser, setEditableUser] = useState({
    userID: '',
    email: '',
    userType: '',
  });

  useEffect(() => {
    // Fetch users from the backend or your data source
    // Replace this with the actual API endpoint for fetching users
    axios.get('http://localhost:8080/user/getallusers')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
      console.log(users)
  }, []);
  console.log({users});
  const handleEditClick = (userID) => {
    setEditableUser({
      userID: '',
      name:'',
      contact:'',
      userType: '',
    });

    // Set initial values for the editable user
    const userToEdit = users.find(user => user.userID === userID);
    setEditableUser({
      userID: userToEdit.userID,
      name: userToEdit.name,
      contact: userToEdit.contact,
      userType: userToEdit.role
    });
    console.log({editableUser})
  };

  const handleInputChange = (field, value) => {
    // Update the state based on the input field being changed
    setEditableUser({
      ...editableUser,
      [field]: value,
    });
  };

  const handleDeleteClick = (userID) => {
    // Make an API call to delete the user
    axios.delete(`http://localhost:8080/user/deleteuser?requestId=${userID}`)
      .then(() => {
        // Remove the user from the local state
        setUsers(users.filter(user => user.userID !== userID));
      })
      .catch(error => console.error('Error deleting user:', error));
      console.log(userID)
  };

  const handleSaveChangesClick = (userID) => {
    // Make an API call to update the user data
    const api = `http://localhost:8080/user/updateuser?userId=${userID}&name=${editableUser.name}&contact=${editableUser.contact}`
    axios.put(api)
      .then(response => {
        // Update the local state with the updated user data
        setUsers(users.map(user => (user.userID === userID ? response.data : user)));
        console.log({users});
      })
      .catch(error => console.error('Error updating user data:', error));
  };

  return (
    <div>
      <h2>User Grid</h2>
      <div className="card-grid">
        {users.map(user => (
          <div key={user.userID} className="card">
            {editableUser.userID === user.userID ? (
              // Edit mode
              <>
                <h3>{user.userID}</h3>

                <p>Name: {user.name}</p>
                <label>Contact:</label>
                <input
                  type="text"
                  value={editableUser.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                />
                <p>User Type: {user.role}</p>
                <button onClick={() => handleDeleteClick(user.userID)}>Delete</button>
                <button onClick={() => handleSaveChangesClick(user.userID)}>Submit Changes</button>
              </>
            ) : (
              // Display mode
              <>
                <h3>{user.userID}</h3>
                <p>Name: {user.name}</p>
                <p>Contact: {user.contact}</p>
                <p>Email: {user.userID}</p>
                <p>User Type: {user.role}</p>
                <button onClick={() => handleEditClick(user.userID)}>Edit</button>

              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserGrid;
