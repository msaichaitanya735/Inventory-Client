// src/components/PurchaseOrdersPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PurchaseOrderRow from './PurchaseOrderRow';
import productData from '../../sampledata/product.json';

const PurchaseOrdersPage = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [products, setProducts] = useState(productData);

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        // Fetch purchase orders from the backend
        // Replace with actual API endpoint
        const response = await axios.get(`http://44.203.214.233:8080/order/getpurchases?supplierId=${localStorage.getItem('userId')}`);
        setPurchaseOrders(response.data || []); // Ensure it's an array or use an empty array if undefined
      } catch (error) {
        console.error('Error fetching purchase orders:', error);
      }
    };

    const fetchAllProducts = async () => {
      try {
        // Fetch all products from the backend
        // Replace with actual API endpoint
        const response = await axios.get('http://44.203.214.233:8080/inventory/fetchallproducts');
        setProducts(response.data || []); // Ensure it's an array or use an empty array if undefined
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchPurchaseOrders();
    fetchAllProducts();
  }, []);

  const handleAccept = async (purchaseID, quotationPrice) => {
    try {
      // Make an API call to update the purchase order with the accepted price
      // Replace with actual API endpoint and logic
      const api = `http://44.203.214.233:8080/order/addquotationforpurchase?purchaseId=${purchaseID}&supplierId=${localStorage.getItem('userId')}&price=${quotationPrice}`;
      const response = await axios.post(api);
      // Update the local state with the updated purchase orders
      setPurchaseOrders(response.data || []);
      console.log({ purchaseID, quotationPrice });
    } catch (error) {
      console.error('Error accepting purchase order:', error);
    }
  };

  return (
    <div>
      <h1>Purchase Orders</h1>
      {Array.isArray(purchaseOrders) &&
        purchaseOrders.map(order => {
          // Find the corresponding product for each purchase order
          const product = products.find(product => product.productID === order.productID);
          return (
            <PurchaseOrderRow
              key={order.purchaseID}
              product={product}
              quantity={order.quantity}
              onAccept={(quotationPrice) => handleAccept(order.purchaseID, quotationPrice)}
            />
          );
        })}
    </div>
  );
};

export default PurchaseOrdersPage;
