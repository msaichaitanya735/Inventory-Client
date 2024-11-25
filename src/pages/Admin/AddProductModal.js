// src/components/AddProductModal.js
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const AddProductModal = ({ isOpen, onRequestClose, onAddProduct }) => {
  const [categories,setCategories] = useState([]);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productImageURL, setProductImageURL] = useState('');
  const [productUnitsOfMeasure, setProductUnitsOfMeasure] = useState('');
  const [returnable, setReturnable] = useState(false);


  useEffect(() => {
      axios.get(' http://localhost:8080/inventory/fetchallcategories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
      console.log(categories);
  }, []);

  const handleAddProduct = () => {
    console.log('handleaddproducts')
    // Validate and send product data to the parent component
   
      const newProduct = {
        name: productName,
        description: productDescription,
        categoryID: productCategory,
        imgURL: productImageURL,
        returnable: returnable
      };
      onAddProduct(newProduct);
      console.log({newProduct});
      
      const apiUrl = ` http://localhost:8080/inventory/addproduct?name= ${productName}&description= ${productDescription}&categoryId=${productCategory}&imgURL= ${productImageURL}&returnable=${returnable}`;
      console.log(apiUrl);
      // Handle saving changes to the backend if needed
      // Update the productData array or make an API call to update the product
      // For simplicity, let's just log the updated product and productId
      axios.post(apiUrl)
          .then((response) => {
            // Handle the success response
            console.log('Update Successful:', response.data);
      
            // If needed, you can update your local state or perform additional actions
          })
          .catch((error) => {
            // Handle errors
            console.error('Error updating product:', error);
          })
          .finally(() => {
            // Reset editableProductId after the request is complete
                  setProductName('');
      setProductDescription('');
      setProductCategory('');
      setProductImageURL('');
      setProductUnitsOfMeasure('');
          });
  
      // Clear input fields

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
        {/* <input
          type="text"
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
          style={inputStyle}
        /> */}
        <select
                      id="category"
                      style={selectStyle}
                      name="category"
                      onChange={(e)=>setProductCategory(e.target.value)}
                    >
                    {categories.map((cat)=>{
                        console.log(cat);
                        return(<option value={cat.categoryID}>{cat.name}</option>)
                        
                    })}     
                    </select>
        <label style={labelStyle}>Returnable:</label>
        <select
      style={selectStyle}
      value={returnable}
      onChange={(e) => setReturnable(e.target.value === 'true')}
    >
      <option value="true">Yes</option>
      <option value="false">No</option>
    </select>
        <label style={labelStyle}>Image URL:</label>
        <input
          type="text"
          value={productImageURL}
          onChange={(e) => setProductImageURL(e.target.value)}
          style={inputStyle}
        />

        <button type="button" onClick={handleAddProduct} style={buttonStyle}>
          Add Product
        </button>
      </form>
    </Modal>
  );
};

export default AddProductModal;
