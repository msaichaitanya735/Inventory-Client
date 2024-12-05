import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import QuotationModal from './QuotationModal';
import MessagesModal from './MessagesModal'; // Import the MessagesModal component
import './QuotationsPage.css';
import './Inventory.css'; // Import the Inventory CSS for consistent styling

const QuotationsPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [Purchases, setPurchases] = useState([]);
  const [selectedProductQuotations, setSelectedProductQuotations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]); // Add state for messages
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false); // Add state for messages modal
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://saichaitanyamuthyala.com/inventory/viewpurchases')
      .then(response => setPurchases(response.data))
      .catch(error => console.error('Error fetching purchases:', error));

    axios.get('https://saichaitanyamuthyala.com/inventory/fetchallproducts')
      .then(response => setAllProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));

    axios.get('https://saichaitanyamuthyala.com/inventory/viewquotations')
      .then(response => setQuotations(response.data))
      .catch(error => console.error('Error fetching quotations:', error));
  }, []);

  const PurchaseProducts = Purchases.map((item1) => {
    const matchingItem = allProducts.find((item2) => item2.productID === item1.productID);
    return {
      ...item1,
      ...matchingItem,
    };
  });

  const handleAcceptQuotation = (quotationID) => {
    axios.post(`/api/quotations/${quotationID}/accept`)
      .then(response => {
        console.log('Quotation accepted successfully:', response.data);
      })
      .catch(error => console.error('Error accepting quotation:', error));
  };

  const handleRejectQuotation = (quotationID) => {
    axios.post(`/api/quotations/${quotationID}/reject`)
      .then(response => {
        console.log('Quotation rejected successfully:', response.data);
      })
      .catch(error => console.error('Error rejecting quotation:', error));
  };

  const handleViewQuotation = (purchaseID) => {
    const quotationsForProduct = PurchaseProducts.filter(product => product.purchaseID === purchaseID);
    setSelectedProductQuotations(quotationsForProduct);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogOut = () => {
    localStorage.clear();
    navigate('/');
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

  return (
    <div className="quotations-page">
      {/* Header Section */}
      <div className="header">
        <button className="notification-btn" onClick={handleOpenMessages}>Notifications</button>
        <button className="logout-btn" onClick={handleLogOut}>Logout</button>
      </div>

      {/* Body Section */}
      <div className="body">
        <h1>Purchases</h1>
        <div className="inventory_buttonsRow">
          <button><Link to="/inventory">View Inventory</Link></button>
          <button><Link to="/restock">Restock Inventory</Link></button>
        </div>

        <table className="quotation-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Accepted Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {PurchaseProducts.map(product => (
              <tr key={product.productID}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.status}</td>
                <td>{product.acceptedPrice}</td>
                <td>
                  {product.status !== "ACCEPTED" &&
                    <button onClick={() => handleViewQuotation(product.purchaseID)}>View Quotation</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <QuotationModal product={selectedProductQuotations} onClose={handleCloseModal} />
        )}

        {isMessagesModalOpen && (
          <MessagesModal messages={messages} onClose={handleCloseMessagesModal} />
        )}
      </div>
    </div>
  );
};

export default QuotationsPage;
