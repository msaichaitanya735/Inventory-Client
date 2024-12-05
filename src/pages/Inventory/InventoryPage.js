import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import './Inventory.css';
import MessagesModal from './MessagesModal';
import { useNavigate } from 'react-router-dom';
import AddProductModalInventory from './AddProductModalInventory';

const InventoryPage = () => {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [productCategory, setProductCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [productsnotin, setProduc] = useState();
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editableProduct, setEditableProduct] = useState(null);
  const [messages, setMessages] = useState([]); // Add state for messages
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch inventory data from the backend
    axios.get('https://saichaitanyamuthyala.com/inventory/fetchallcategories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));

    axios.get('https://saichaitanyamuthyala.com/inventory/fetchinventory')
      .then(response => setInventory(response.data))
      .catch(error => console.error('Error fetching inventory:', error));

    axios.get('https://saichaitanyamuthyala.com/inventory/fetchallproducts')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  useEffect(() => {
    axios.get(`https://saichaitanyamuthyala.com/inventory/fetchinventorybasedoncategory?categoryName=${productCategory}`)
      .then((res) => console.log(res.data));
  }, [productCategory]);

  const InventoryList = inventory.map((item1) => {
    const matchingItem = products.find((item2) => item2.productID === item1.productID);
    return {
      ...item1,
      ...matchingItem, // Add properties from list2 to the merged item
    };
  });

  const handleOpenAddProductModal = () => {
    setIsAddProductModalOpen(true);
  };

  const handleCloseAddProductModal = () => {
    setIsAddProductModalOpen(false);
  };

  const handleAddProducts = (newProduct) => {
    // Add the new product to the products state
    setProducts([...products, newProduct]);
    // Close the modal
    handleCloseAddProductModal();
  };

  const handleAddProduct = (productId, reorderpoint) => {
    axios.post('/api/inventory/add', { productId, quantity: 0 })
      .then(response => {
        setInventory(response.data);
        setIsModalOpen(false);
      })
      .catch(error => console.error('Error adding product to inventory:', error));

    setIsModalOpen(false);
  };

  const handleEdit = (productId) => {
    const productToEdit = InventoryList.find(item => item.productID === productId);
    setSelectedProduct(productToEdit);
    setIsEditModalOpen(true);
  };

  const handleDelete = (productId) => {
    const api = `https://saichaitanyamuthyala.com/inventory/deletefrominventory?productId=${productId}`;
    axios.delete(api)
      .then(res => console.log('Deleted successfully'))
      .catch(error => console.error('Error deleting product:', error));
      window.location.reload();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveEdit = (editedProduct) => {
    axios.put(`https://saichaitanyamuthyala.com/inventory/addproducttoinventory`, editedProduct)
      .then(response => {
        setInventory(response.data);
        setIsEditModalOpen(false);
      })
      .catch(error => console.error('Error editing product:', error));
  };

  const handleOpenMessages = () => {
    axios.get('https://saichaitanyamuthyala.com/inventory/getmessagesinventory')
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
    <div className="inventory-page">
      {/* Header Section */}
      <div className="header">
        <h1 className="header-title">Inventory</h1>
        <div className="header-buttons">
          <button className="notification-btn" onClick={handleOpenMessages}>Notifications</button>
          <button className="logout-btn" onClick={handleLogOut}>Logout</button>
        </div>
      </div>

      {/* Body Section */}
      <div className="body">
        <div className="inventory_buttonsRow">
          <button className="button-grey" onClick={() => setIsModalOpen(true)}>Add Existing Products</button>
          {isModalOpen && (
            <AddProductModal onAdd={handleAddProduct} onClose={handleCloseModal} />
          )}
          <button className="button-grey" onClick={handleOpenAddProductModal}>Add New Product</button>
          <AddProductModalInventory
            isOpen={isAddProductModalOpen}
            onRequestClose={handleCloseAddProductModal}
            onAddProduct={handleAddProducts}
          />
          <button className="button-grey"><Link to="/restock">Restock Inventory</Link></button>
          <button className="button-grey"><Link to="/quotations">View Quotations</Link></button>
        </div>
        
        {/* Display Inventory Products */}
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Reorder Point</th>
              <th>Units</th>
              <th>Edit</th>
              {/* <th>Delete</th> */}
            </tr>
          </thead>
          <tbody>
            {InventoryList.map(item => (
              <tr key={item.productID}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.reorderpoint}</td>
                <td>{item.units}</td>
                <td><button className="edit-btn" onClick={() => handleEdit(item.productID)}>Edit</button></td>
                {/* <td><button className="delete-btn" onClick={() => handleDelete(item.productID)}>Delete</button></td> */}
              </tr>
            ))}
          </tbody>
        </table>
        {selectedProduct && (
          <EditProductModal
            product={selectedProduct}
            onClose={handleCloseModal}
          />
        )}
        {isMessagesModalOpen && (
          <MessagesModal messages={messages} onClose={handleCloseMessagesModal} />
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
