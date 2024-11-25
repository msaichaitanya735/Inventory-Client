import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Supplier.css';
import { useNavigate } from 'react-router-dom';
import MessagesModal from './MessagesModal';
import AddProductModal from './AddProductModal';

const SupplierManagementPage = () => {
  const navigate = useNavigate();
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [supplierProducts, setSupplierProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);

  useEffect(() => {
    const fetchSupplierProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/inventory/getsupplier?supplierId=${localStorage.getItem('userId')}`);
        setSupplierProducts(response.data.products || []);
      } catch (error) {
        console.error('Error fetching supplier products:', error);
      }
    };
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/order/getproductsnotinsupplier?supplierId=${localStorage.getItem('userId')}`);
        setAllProducts(response.data || []); // Ensure it's an array or use an empty array if undefined
      } catch (error) {
        console.error('Error fetching all products:', error);
      }
    };

    fetchSupplierProducts();
    fetchAllProducts();
  }, []);

  const handleOpenAddProductModal = () => {
    setIsAddProductModalOpen(true);
  };

  const handleCloseAddProductModal = () => {
    setIsAddProductModalOpen(false);
  };

  const handleAddProduct = async (productId) => {
    try {
      const response = await axios.post(`http://localhost:8080/order/addsupplierproduct?supplierId=${localStorage.getItem('userId')}&productId=${productId}`);
      setSupplierProducts(response.data || []); // Ensure it's an array or use an empty array if undefined
      window.location.reload();

    } catch (error) {
      console.error('Error adding product to supplier:', error);
    }
  };
const handleDeleteAllProducts = async () => {
  try {
    const response = await axios.delete('http://localhost:8080/inventory/deleteproductsfromsupplier', {
      params: { supplierId: localStorage.getItem('userId')}
    });
    window.location.reload();
    console.log(response.data); // Handle success response
  } catch (error) {
    console.error('There was an error!', error); // Handle error response
  }
};

  const handleOpenMessages = () => {
    axios.get(`http://localhost:8080/inventory/getmessagesinventory`)
      .then(response => setMessages(response.data))
      .catch(error => console.error('Error fetching messages:', error));
    setIsMessagesModalOpen(true);
  };

  const handleCloseMessagesModal = () => {
    setIsMessagesModalOpen(false);
  };

  const handleLogOut = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div>
      <div className="nav-bar">
        <div>
          <h1>Your Supplier App</h1>
        </div>
        <div>
          <a className="nav-link" onClick={handleOpenMessages}>
            Notifications
          </a>
          <a href="/purchase-orders" className="nav-link">
            Purchase Orders Page
          </a>
          <a href="#" className="nav-link" onClick={handleLogOut}>
            Logout
          </a>
        </div>
      </div>
      <div>
        <div>
          <div className='supHeader'>
            <h2>Supplier's Product List</h2>
            <h2>
              <button onClick={handleOpenAddProductModal}>Add Product</button>
              <button onClick={handleDeleteAllProducts} className="delete-button">Delete All Products</button>
              <AddProductModal
                isOpen={isAddProductModalOpen}
                onRequestClose={handleCloseAddProductModal}
                onAddProduct={handleAddProduct}
              />
            </h2>
          </div>
          <ul>
            {Array.isArray(supplierProducts) && supplierProducts.map(product => (
              <li key={product.productId}>{product.name}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2>All Products</h2>
          <ul className="product-grid">
            {Array.isArray(allProducts) && allProducts.map(product => (
              <div key={product.productID} className='card'>
                <div>
                  <img src={product.imgURL} alt={product.name} />
                  <p>{product.name}</p>
                  <button onClick={() => handleAddProduct(product.productID)}>Add to Supplier</button>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
      {isMessagesModalOpen && (
        <MessagesModal messages={messages} onClose={handleCloseMessagesModal} />
      )}
    </div>
  );
};

export default SupplierManagementPage;
