import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [productDetails, setProductDetails] = useState({}); // Store product details by product ID
  const [showReturnModal, setShowReturnModal] = useState(false); // Modal state
  const [modalMessage, setModalMessage] = useState(''); // Modal message
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch order history data from the backend
    axios.get(`https://main.dwoh96qwfxa1j.amplifyapp.com/order/getorders?retailerId=${localStorage.getItem('userId')}`)
      .then(response => {
        setOrderHistory(response.data);

        // Fetch product details for each order
        const productIds = response.data.map(order => order.productId);
        const fetchProductDetails = async () => {
          const productResponses = await Promise.all(
            productIds.map(productId =>
              axios.get(`https://main.dwoh96qwfxa1j.amplifyapp.com/inventory/getproduct?productId=${productId}`)
            )
          );
          // Map product details to their IDs for quick access
          const products = productResponses.reduce((acc, res) => {
            acc[res.data.productID] = res.data;
            return acc;
          }, {});
          setProductDetails(products);
        };
        fetchProductDetails();
      })
      .catch(error => console.error('Error fetching order history:', error));
  }, []);

  const handleLogOut = () => {
    navigate('/');
    localStorage.clear();
  };

  const handleInitiateReturn = async (orderId) => {
    try {
      const response = await axios.put(`https://main.dwoh96qwfxa1j.amplifyapp.com/order/initiateReturn`, null, {
        params: { orderId }
      });
      setModalMessage("Return has been initiated successfully.");
      setShowReturnModal(true);

      // Update the order history to reflect the "Return Initiated" status
      setOrderHistory(prevOrders =>
        prevOrders.map(order =>
          order.orderID === orderId ? { ...order, returnable: "Return Initiated" } : order
        )
      );
    } catch (error) {
      setModalMessage("Failed to initiate return. Please try again.");
      setShowReturnModal(true);
      console.error('Error initiating return:', error);
    }
  };

  return (
    <div className='retailerBody'>
      <div className="nav-bar">
        <div>
          <h1>Your Retailer App</h1>
        </div>
        <div className='retailerButtons'>
          <a href="#" className="nav-link" onClick={handleLogOut}>Logout</a>
          <a href="/retailer" className="nav-link">Shop</a>
        </div>
      </div>
      
      <div className="order-history-page">
        <h2 className="heading">Order History</h2>
        <div className="order-history">
          {orderHistory.map(order => {
            const product = productDetails[order.productId];
            return (
              <div key={order.orderID} className="order-card">
                {product && <h3>Product Name: {product.name}</h3>}
                <p>Order ID: {order.orderID}</p>
                <p>Order Date: {order.date}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Total Amount: ${order.amount.toFixed(2)}</p>
                {product ? (
                  <div>
                    <p>Description: {product.description}</p>
                    <img src={product.imgURL} alt={product.name} className="product-img" />
                  </div>
                ) : (
                  <p>Loading product details...</p>
                )}
                {order.returnable === "true" && (
                  <button onClick={() => handleInitiateReturn(order.orderID)}>Return</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal to display the return status */}
      {showReturnModal && (
        <div className="return-modal">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={() => setShowReturnModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
