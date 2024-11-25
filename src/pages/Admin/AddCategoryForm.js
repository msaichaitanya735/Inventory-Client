// src/components/AddCategoryForm.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
const AddCategoryForm = ({ isOpen, onRequestClose }) => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');

  const handleAddCategory = () => {

    axios.post(`http://localhost:8080/inventory/addcategory?name=${categoryName}`)
    .then(res=>console.log(res.data))
    // Add logic to send data to the server or update state
    console.log('Category Added:', { categoryName, description });
    // Reset form fields
    setCategoryName('');
    setDescription('');
    // Close the modal
    onRequestClose();
  };

  // Inline styles
  const modalContentStyle = {
    width: '50%',
    height: '70%',
    margin: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const buttonStyle = {
    backgroundColor: '#4caf50',
    color: '#fff',
    padding: '10px',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Category Modal"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: modalContentStyle,
      }}
    >
      <div>
        <h2>Add Category</h2>
        <form>
          <label htmlFor="categoryName" style={labelStyle}>
            Category Name:
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            style={inputStyle}
          />

          <label htmlFor="description" style={labelStyle}>
            Description:
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={inputStyle}
          />

          <button type="button" onClick={handleAddCategory} style={buttonStyle}>
            Add Category
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default AddCategoryForm;
