import React, { useState } from 'react';
import axios from 'axios';

const EditProductModal = ({ product, onClose }) => {
  const [editedProduct, setEditedProduct] = useState({
    productId: product.productID,
    price: product.price,
    reorderpoint: product.reorderpoint,
    units: product.units,
  });

  const handleInputChange = (e) => {
    console.log(editedProduct);
    setEditedProduct({
      ...editedProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveEdit = () => {
    console.log({ editedProduct });
    const api = `http://44.203.214.233:8080/inventory/addproducttoinventory?productId=${editedProduct.productId}&price=${editedProduct.price}&reorderPoint=${editedProduct.reorderpoint}&units=${editedProduct.units}`;
    axios.post(api)
      .then(response => {
        // Handle success response
        onClose();
      })
      .catch(error => console.error('Error editing product:', error));
      window.location.reload();
      window.location.reload();
  };

  return (
    <div className="edit-product-modal">
      <h2>Edit Product</h2>
      <label htmlFor="price">Price:</label>
      <input
        type="text"
        id="price"
        name="price"
        value={editedProduct.price}
        onChange={handleInputChange}
      />
      <label htmlFor="reorderpoint">Reorder Point:</label>
      <input
        type="text"
        id="reorderpoint"
        name="reorderpoint"
        value={editedProduct.reorderpoint}
        onChange={handleInputChange}
      />
      <label htmlFor="units">Units:</label>
      <input
        type="text"
        id="units"
        name="units"
        value={editedProduct.units}
        onChange={handleInputChange}
      />
      <div className="button-container">
        <button onClick={handleSaveEdit} className="save-btn">Save</button>
        <button onClick={onClose} className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
};

export default EditProductModal;
