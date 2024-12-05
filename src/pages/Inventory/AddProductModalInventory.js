import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const AddProductModalInventory = ({ isOpen, onRequestClose, onAddProduct }) => {
  const [categories, setCategories] = useState([]);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productImageURL, setProductImageURL] = useState('');
  const [reorderpoint, setReorderpoint] = useState('0');
  const [units, setUnits] = useState('');
  const [price, setPrice] = useState('0');
  const [productUnitsOfMeasure, setProductUnitsOfMeasure] = useState('');

  useEffect(() => {
    axios.get('https://saichaitanyamuthyala.com/inventory/fetchallcategories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleAddProduct = () => {
    // Validate and send product data to the parent component
    const newProduct = {
      name: productName,
      description: productDescription,
      categoryID: productCategory,
      imgURL: productImageURL,
    };
    
    // Call parent component method to handle the product addition
    onAddProduct(newProduct);

    // API URL for adding a product
    const apiUrl = `https://saichaitanyamuthyala.com/inventory/addproduct?name=${productName}&description=${productDescription}&categoryId=${productCategory}&imgURL=${productImageURL}`;

    // Make POST request to add product
    axios.post(apiUrl)
      .then(response => {
        console.log('Product added successfully:', response.data);
        const prodId =  response.data['productID']
        console.log(prodId)
        const api1 = `https://saichaitanyamuthyala.com/inventory/addproducttoinventory?productId=${prodId}&price=${price}&reorderPoint=${reorderpoint}&units=${units}`;
        axios.post(api1)
            .then(response => {
                console.log('Done');
            })
            .catch(error => console.error('Error adding product to inventory:', error))
            .finally(() => {
                setReorderpoint('');
                setUnits('');
                setPrice('');
            });
        onRequestClose();
        setProductName('');
        setProductDescription('');
        setProductCategory('');
        setProductImageURL('');
        setProductUnitsOfMeasure('');
        window.location.reload();
      })
      .catch(error => {
        console.error('Error adding product:', error);
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
    borderRadius: '4px',
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
          onChange={(e) => setProductCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
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
        <label style={labelStyle}>Reorder Points: </label>
            <input
                type="number"
                id="reorderpoints"
                style={{ width: '35%', padding: '8px', marginBottom: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                name="reorderpoints"
                value={reorderpoint}
                onChange={(e) => setReorderpoint(e.target.value)}
            />
            <label style={labelStyle}>Price</label>
            <input
                type="number"
                id="price"
                style={{ width: '35%', padding: '8px', marginBottom: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
            <label style={labelStyle}>Units of Measure</label>
            <select
                id="units"
                style={{ width: '100%', padding: '8px', marginBottom: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                name="units"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
            >
                <option value="Kgs">Kgs</option>
                <option value="Per Piece">Per Piece</option>
                <option value="Lbs">Lbs</option>
                <option value="Dozen">Dozen</option>
                <option value="Liter">Liter</option>
            </select>

        <button type="button" onClick={handleAddProduct} style={buttonStyle}>
          Add Product
        </button>
      </form>
    </Modal>
  );
};

export default AddProductModalInventory;
