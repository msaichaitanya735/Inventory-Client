import React, { useEffect, useState } from 'react';
import './Grid.css'; // Import a common CSS file for styling
import axios from 'axios';
import AddCategoryForm from './AddCategoryForm';


const CategoryGrid = () => {
  const [isAddCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [categoryData,setCategoryData] = useState([]);
  const [editablecategoryID, setEditablecategoryID] = useState(null);
  const [editableCategory, setEditableCategory] = useState({
    name: '',
    description: '',
  });
  useEffect(() => {
    // Replace 'api/products' with the actual endpoint to fetch products
    axios.get('https://main.dwoh96qwfxa1j.amplifyapp.com/inventory/fetchallcategories')
      .then(response => setCategoryData(response.data))
      .catch(error => console.error('Error fetching products:', error));
      console.log(categoryData);      
  }, []);
  console.log(categoryData)
  const handleEditClick = (categoryID) => {
    setEditablecategoryID(categoryID);
    // Set initial values for the editable category
    const categoryToEdit = categoryData.find(category => category.categoryID === categoryID);
    setEditableCategory({
      name: categoryToEdit.name,
      description: categoryToEdit.description,
    });
  };

  const handleInputChange = (field, value) => {
    // Update the state based on the input field being changed
    setEditableCategory({
      ...editableCategory,
      [field]: value,
    });
  };

  const handleSaveClick = (categoryID) => {
    // Handle saving changes to the backend if needed
    // Update the categoryData array or make an API call to update the category
    // For simplicity, let's just log the updated category and categoryID
    console.log('Updated Category:', editableCategory);
    console.log('Category ID:', categoryID);
    setEditablecategoryID(null);
  };

  const openAddCategoryModal = () => {
    setAddCategoryModalOpen(true);
  };

  const closeAddCategoryModal = () => {
    setAddCategoryModalOpen(false);
  };

  return (
    <div>
      <h2>
      <button onClick={openAddCategoryModal}>Add Category</button>
      <AddCategoryForm isOpen={isAddCategoryModalOpen} onRequestClose={closeAddCategoryModal} />

      </h2>
      <h2>Category Grid</h2>  

      <div className="card-grid">
        {categoryData.map(category => (
          <div key={category.categoryID} className="card">
            {editablecategoryID === category.categoryID ? (
              // Edit mode
              <>
                <label>Category Name:</label>
                <input
                  type="text"
                  value={editableCategory.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
                
                <button onClick={() => handleSaveClick(category.categoryID)}>Submit</button>
              </>
            ) : (
              // Display mode
              <>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                {/* <button onClick={() => handleEditClick(category.categoryID)}>Edit</button> */}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
