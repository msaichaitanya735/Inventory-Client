import React, { useState } from 'react';
// import './AddCategoryForm.css'; // Optional: Your custom styles
import axios from 'axios';

const AddCategoryForm = ({ isOpen, onRequestClose }) => {
  const [categoryName, setCategoryName] = useState('');
  const [returnable, setReturnable] = useState('true');

  const handleAddCategory = () => {
    axios
      .post(
        `https://saichaitanyamuthyala.com/inventory/addcategory?name=${categoryName}&returnable=${returnable}`
      )
      .then(() => {
        onRequestClose();
        window.location.reload();
      })
      .catch((error) => console.error('Error adding category:', error));
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Category</h2>
        <label>Category Name:</label>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <label>Returnable:</label>
        <select
          value={returnable}
          onChange={(e) => setReturnable(e.target.value)}
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <button onClick={handleAddCategory}>Add</button>
        <button onClick={onRequestClose}>Close</button>
      </div>
    </div>
  );
};

export default AddCategoryForm;
