import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const AddProductModal = ({ isOpen, onRequestClose, onAddProduct }) => {
  const [categories, setCategories] = useState([]);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productImageURL, setProductImageURL] = useState('');
  const [returnable, setReturnable] = useState(false);

  useEffect(() => {
    // Fetch all categories
    axios
      .get('https://saichaitanyamuthyala.com/inventory/fetchallcategories')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategoryID = e.target.value;
    setProductCategory(selectedCategoryID);

    // Find the selected category and set its returnable value
    const selectedCategory = categories.find(
      (cat) => cat.categoryID === selectedCategoryID
    );
    if (selectedCategory) {
      setReturnable(selectedCategory.returnable === 'true'); // Assuming returnable is stored as a string
    }
  };

  const handleAddProduct = () => {
    const newProduct = {
      name: productName,
      description: productDescription,
      categoryID: productCategory,
      imgURL: productImageURL,
      returnable,
    };

    onAddProduct(newProduct);

    const apiUrl = `https://saichaitanyamuthyala.com/inventory/addproduct?name=${productName}&description=${productDescription}&categoryId=${productCategory}&imgURL=${productImageURL}&returnable=${returnable}`;
    axios
      .post(apiUrl)
      .then((response) => {
        console.log('Product added successfully:', response.data);
        onRequestClose();
      })
      .catch((error) => {
        console.error('Error adding product:', error);
      })
      .finally(() => {
        // Reset form fields
        setProductName('');
        setProductDescription('');
        setProductCategory('');
        setProductImageURL('');
      });
  };

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

  const selectStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Product Modal"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: modalContentStyle,
      }}
    >
      <h2>Add Product</h2>
      <form>
        <label style={labelStyle}>Name:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          style={inputStyle}
        />

        <label style={labelStyle}>Description:</label>
        <textarea
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          style={inputStyle}
        />

        <label style={labelStyle}>Category:</label>
        <select
          id="category"
          style={selectStyle}
          name="category"
          value={productCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.categoryID} value={cat.categoryID}>
              {cat.name}
            </option>
          ))}
        </select>

        <label style={labelStyle}>Image URL:</label>
        <input
          type="text"
          value={productImageURL}
          onChange={(e) => setProductImageURL(e.target.value)}
          style={inputStyle}
        />

        <p>Returnable: {returnable ? 'Yes' : 'No'}</p>

        <button type="button" onClick={handleAddProduct} style={buttonStyle}>
          Add Product
        </button>
      </form>
    </Modal>
  );
};

export default AddProductModal;
