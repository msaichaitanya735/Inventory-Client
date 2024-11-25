// src/components/PurchaseOrderRow.js
import React, { useState } from 'react';
import './Purchase.css';

const PurchaseOrderRow = ({ product, quantity, onAccept }) => {
  const [quotationPrice, setQuotationPrice] = useState('');
    console.log({product})
  const handleAccept = () => {
    console.log({product})
    // const api = `http://44.203.214.233:8080/order/addquotationforpurchase?purchaseId=${}&supplierId=${}&price=${}`
    onAccept(quotationPrice);
    window.location.reload()
  };

  return (
    <div className="purchase-order-row">
      <div>
        <img src={product.imgURL} alt={product.name} style={{ width: '100px', height: '100px', marginRight: '10px' }} />
      </div>
      <div>
        <p>Product: {product.name}</p>
        <p>Quantity: {quantity}</p>
      </div>
      <div>
        <label>Quotation Price:</label>
        <input
          type="number"
          value={quotationPrice}
          onChange={(e) => setQuotationPrice(e.target.value)}
        />
        <button onClick={handleAccept}>Quote</button>
      </div>
    </div>
  );
};

export default PurchaseOrderRow;
