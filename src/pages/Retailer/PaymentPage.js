import React, { useState } from 'react';
import axios from 'axios';
import './PaymentPage.css';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePayment = async () => {
    try {
      const itemsForPayment = JSON.parse(localStorage.getItem('ItemsForPayment'));

      if (itemsForPayment && itemsForPayment.length > 0) {
        for (const item of itemsForPayment) {
          const response = await axios.post(`https://saichaitanyamuthyala.com/order/orderproduct?retailerId=${localStorage.getItem('userId')}&productId=${item.productId}&quantity=${item.quantity}&method=${paymentType}&role=${localStorage.getItem('role')}&returnable=${item.returnable}`);
          console.log(response.data);
          console.log(`Payment for Product ID ${item.productId} successful!`);
        }
        localStorage.removeItem('ItemsForPayment');
      } else {
        console.log('No items for payment.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    }
    localStorage.removeItem('ItemsForPayment');
    console.log("Thank you");
    navigate('/retailer');
  };

  return (
    <div className="payment-container">
      <div className="payment-box">
        <h2>Payment Details</h2>
        <form>
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
