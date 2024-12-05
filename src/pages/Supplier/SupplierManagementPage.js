import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Supplier.css';
import { useNavigate } from 'react-router-dom';
import MessagesModal from './MessagesModal';
import AddProductModal from './AddProductModal';

const SupplierManagementPage = () => {
  const navigate = useNavigate();
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [supplierProducts, setSupplierProducts] = useState([]);  // Supplier's products state
  const [allProducts, setAllProducts] = useState([]);  // All available products
  const [messages, setMessages] = useState([]);
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const userId = localStorage.getItem('userId');  // Fetch user ID from localStorage

  // Fetch products on login or page load
  useEffect(() => {
    if (userId) {
      fetchSupplierProducts(userId);  // Fetch supplier products
      fetchAllProducts(userId);  // Fetch all products that are not yet added
    }
  }, [userId]);

  // Function to fetch supplier products from the backend
  const fetchSupplierProducts = async (userId) => {
    try {
      const response = await axios.get(`https://saichaitanyamuthyala.com/inventory/getsupplier?supplierId=${userId}`);
      setSupplierProducts(response.data.products || []);  // Set the list of supplier's products
    } catch (error) {
      console.error('Error fetching supplier products:', error);
    }
  };

  // Function to fetch all products that are not yet added to the supplier's list
  const fetchAllProducts = async (userId) => {
    try {
      const response = await axios.get(`https://saichaitanyamuthyala.com/order/getproductsnotinsupplier?supplierId=${userId}`);
      setAllProducts(response.data || []);  // Set all products that are available to be added
    } catch (error) {
      console.error('Error fetching all products:', error);
    }
  };

  const handleOpenAddProductModal = () => {
    setIsAddProductModalOpen(true);
  };

  const handleCloseAddProductModal = () => {
    setIsAddProductModalOpen(false);
  };

  // Check for duplicates using productId
  const handleAddProduct = async (productId) => {
    // First, check if the product is already added in the supplier's product list
    const productExists = supplierProducts.some(product => product.productId === productId);

    if (productExists) {
      setNotification('This product is already in your product list!');
      setTimeout(() => setNotification(''), 3000); // Clear notification after 3 seconds
      return; // Prevent adding the product if it already exists
    }

    // Find the product to add from all available products
    const productToAdd = allProducts.find(product => product.productID === productId);

    if (!productToAdd) {
      setNotification('Product not found!');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    try {
      // Add the product to the supplier's product list via API call
      await axios.post(`https://saichaitanyamuthyala.com/order/addsupplierproduct?supplierId=${userId}&productId=${productId}`);

      // Manually update the supplierProducts state with the new product
      setSupplierProducts(prevProducts => [
        ...prevProducts,
        { ...productToAdd, productId: productToAdd.productID }  // Ensure product structure matches backend
      ]);

      setNotification('Product added successfully!');
      setTimeout(() => setNotification(''), 3000); // Clear notification after 3 seconds
    } catch (error) {
      console.error('Error adding product to supplier:', error);
      setNotification('Error adding product, please try again.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const handleDeleteAllProducts = async () => {
    try {
      await axios.delete('https://saichaitanyamuthyala.com/inventory/deleteproductsfromsupplier', {
        params: { supplierId: userId }
      });
      setSupplierProducts([]); // Clear the supplier products list after deletion
    } catch (error) {
      console.error('Error deleting all products:', error);
    }
  };

  const handleOpenMessages = () => {
    axios.get(`https://saichaitanyamuthyala.com/inventory/getmessagesinventory`)
      .then(response => setMessages(response.data))
      .catch(error => console.error('Error fetching messages:', error));
    setIsMessagesModalOpen(true);
  };

  const handleCloseMessagesModal = () => {
    setIsMessagesModalOpen(false);
  };

  const handleLogOut = () => {
    localStorage.clear();
    setSupplierProducts([]); // Clear the state as well when logging out
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
        <div className='supHeader'>
          <h2>Supplier's Product List</h2>
          <button onClick={handleOpenAddProductModal}>Add Product</button>
          <button onClick={handleDeleteAllProducts} className="delete-button">Delete All Products</button>
          <AddProductModal
            isOpen={isAddProductModalOpen}
            onRequestClose={handleCloseAddProductModal}
            onAddProduct={handleAddProduct}
          />
        </div>

        <ul>
          {Array.isArray(supplierProducts) && supplierProducts.map(product => (
            <li key={product.productId}>{product.name}</li>
          ))}
        </ul>

        <div>
          <h2>All Products</h2>
          <ul className="product-grid">
            {Array.isArray(allProducts) && allProducts.map(product => (
              <div key={product.productID} className='card'>
                <img src={product.imgURL} alt={product.name} />
                <p>{product.name}</p>
                <button onClick={() => handleAddProduct(product.productID)}>Add to Supplier</button>
              </div>
            ))}
          </ul>
        </div>

        {isMessagesModalOpen && (
          <MessagesModal messages={messages} onClose={handleCloseMessagesModal} />
        )}

        {/* Notification message */}
        {notification && <div className="notification">{notification}</div>}
      </div>
    </div>
  );
};

export default SupplierManagementPage;
