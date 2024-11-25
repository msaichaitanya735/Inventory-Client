import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const paymentData = {
      paymentType,
      cardNumber,
    };

    try {
      const response = await axios.post('YOUR_BACKEND_API_ENDPOINT', paymentData);
      console.log('Payment successful:', response.data);
    } catch (error) {
      console.error('Error processing payment:', error.message);
    }
  };

  const handlePayment = async () => {
    console.log('here');
    try {
      const api = `http://localhost:8080/inventory/acceptquotaion?purchaseId=${quotation.purchaseID}&quotationId=${quotation.quotationID}`;
      const response = await axios.post(api);
      console.log(response.data);
    } catch (error) {
      console.error('Error accepting quotation:', error);
    }
    navigate('/inventory'); // Navigate to the inventory page after successful payment
  };

  const quotation = JSON.parse(localStorage.getItem('quotation'));

  return (
    <div className="payment-container">
      <div className="payment-box">
        <h2>Payment Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Payment Type:</label>
            <select onChange={(e) => setPaymentType(e.target.value)} value={paymentType}>
              <option value="">Select...</option>
              <option value="credit">Credit Card</option>
              <option value="debit">Debit Card</option>
            </select>
          </div>

          {paymentType && (
            <div>
              <div className="form-group">
                <label>Card Number:</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Name on Card:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Expiry:</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder='MM/YYYY'
                />
              </div>
              <div className="form-group">
                <label>CVV:</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </div>
              <div className="cart-total">
                <p>Total Price: ${localStorage.getItem("Total")}</p>
              </div>
            </div>
          )}

          <button type="button" onClick={handlePayment}>Pay Now</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
