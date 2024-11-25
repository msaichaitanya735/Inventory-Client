import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './RestockPage.css';
import './Inventory.css'; // Import the Inventory CSS for consistent styling
import MessagesModal from './MessagesModal'; // Import the MessagesModal component

const RestockPage = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [restockQuantities, setRestockQuantities] = useState({});
  const [messages, setMessages] = useState([]); // Add state for messages
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false); // Add state for messages modal
  const [purchaseStatus, setPurchaseStatus] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://44.203.214.233:8080/inventory/fetchinventory')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));

    axios.get('http://44.203.214.233:8080/inventory/fetchallproducts')
      .then(response => setAllProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const ActualProducts = products.map((item1) => {
    const matchingItem = allProducts.find((item2) => item2.productID === item1.productID);
    return {
      ...item1,
      ...matchingItem,
    };
  });

  const handleRestockQuantityChange = (productId, quantity) => {
    setRestockQuantities(prevState => ({
      ...prevState,
      [productId]: quantity,
    }));
  };

  const handlePurchase = (productId) => {
    const api = `http://44.203.214.233:8080/inventory/purchaseproduct?productId=${productId}&quantity=${restockQuantities[productId]}`;
    axios.post(api)
      .then(response => {
        console.log('Item restocked successfully:', response.data);
        setPurchaseStatus(prevState => ({
          ...prevState,
          [productId]: true,
        }));
      })
      .catch(error => console.error('Error restocking item:', error));
  };

  const handleLogOut = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleOpenMessages = () => {
    axios.get('http://44.203.214.233:8080/inventory/getmessagesinventory')
      .then(response => setMessages(response.data))
      .catch(error => console.error('Error fetching messages:', error));

    setIsMessagesModalOpen(true);
  };

  const handleCloseMessagesModal = () => {
    setIsMessagesModalOpen(false);
  };

  return (
    <div className="restock-page">
      <div className="header">
        <h1 className="header-title">Inventory</h1>
        <div className="header-buttons">
          <button className="notification-btn" onClick={handleOpenMessages}>Notifications</button>
          <button className="logout-btn" onClick={handleLogOut}>Logout</button>
        </div>
      </div>
      {/* Body Section */}
      <div className="body">
        <h1>Restock Inventory</h1>
        <div className="inventory_buttonsRow">
          <button><Link to="/inventory">View Inventory</Link></button>
          <button><Link to="/quotations">View Quotations</Link></button>
        </div>

        <div className="restock-list">
          {ActualProducts.map(product => (
            <div key={product.productID} className="restock-card">
              <img src={product.imgURL} alt={product.name} />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </div>
              <div className="quantity-input">
                <input
                  type="number"
                  placeholder="Quantity"
                  value={restockQuantities[product.productID] || ''}
                  onChange={(e) => handleRestockQuantityChange(product.productID, e.target.value)}
                />
              </div>
              <button
              className={purchaseStatus[product.productID] ? 'done-button' : 'purchase-button'}
              onClick={() => handlePurchase(product.productID)}
              disabled={purchaseStatus[product.productID]} // Disable the button after purchase
            >
              {purchaseStatus[product.productID] ? 'Done' : 'Purchase'}
            </button>
            </div>
          ))}
        </div>

        {isMessagesModalOpen && (
          <MessagesModal messages={messages} onClose={handleCloseMessagesModal} />
        )}
      </div>
    </div>
  );
};

export default RestockPage;
