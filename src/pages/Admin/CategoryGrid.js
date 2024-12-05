import React, { useState, useEffect } from 'react';
import './Grid.css'; // Import your CSS file
import axios from 'axios';
import AddCategoryForm from './AddCategoryForm';

const CategoryGrid = () => {
  const [isAddCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [editableCategoryID, setEditableCategoryID] = useState(null);
  const [editableCategory, setEditableCategory] = useState({
    name: '',
    returnable: '', // Adjusting to include 'returnable'
  });

  // Fetch categories on component load
  useEffect(() => {
    axios
      .get('http://localhost:8080/inventory/fetchallcategories')
      .then((response) => setCategoryData(response.data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  // Open the Add Category modal
  const openAddCategoryModal = () => {
    setAddCategoryModalOpen(true);
  };

  // Close the Add Category modal
  const closeAddCategoryModal = () => {
    setAddCategoryModalOpen(false);
  };

  // Handle the Edit button click
  const handleEditClick = (categoryID) => {
    setEditableCategoryID(categoryID);
    const categoryToEdit = categoryData.find(
      (category) => category.categoryID === categoryID
    );
    setEditableCategory({
      name: categoryToEdit.name,
      returnable: categoryToEdit.returnable,
    });
  };

  // Handle input changes for editable fields
  const handleInputChange = (field, value) => {
    setEditableCategory({
      ...editableCategory,
      [field]: value,
    });
  };

  // Handle Save button click
  const handleSaveClick = (categoryID) => {
    axios
      .put(
        `http://localhost:8080/inventory/updatecategory?categoryID=${categoryID}&name=${editableCategory.name}&returnable=${editableCategory.returnable}`
      )
      .then(() => {
        setEditableCategoryID(null); // Exit edit mode
        window.location.reload(); // Reload the page to fetch updated categories
      })
      .catch((error) => console.error('Error updating category:', error));
  };

  return (
    <div>
      <h2>
        <button onClick={openAddCategoryModal}>Add Category</button>
        <AddCategoryForm
          isOpen={isAddCategoryModalOpen}
          onRequestClose={closeAddCategoryModal}
        />
      </h2>
      <h2>Category Grid</h2>

      <div className="card-grid">
        {categoryData.map((category) => (
          <div key={category.categoryID} className="card">
            {editableCategoryID === category.categoryID ? (
              <>
                <label>Category Name:</label>
                <input
                  type="text"
                  value={editableCategory.name}
                  onChange={(e) =>
                    handleInputChange('name', e.target.value)
                  }
                />
                <label>Returnable:</label>
                <select
                  value={editableCategory.returnable}
                  onChange={(e) =>
                    handleInputChange('returnable', e.target.value)
                  }
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
                <button onClick={() => handleSaveClick(category.categoryID)}>
                  Save
                </button>
              </>
            ) : (
              <>
                <h3>{category.name}</h3>
                <p>Returnable: {category.returnable}</p>
                <button
                  onClick={() => handleEditClick(category.categoryID)}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
