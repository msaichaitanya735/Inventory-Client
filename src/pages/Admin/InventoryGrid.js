import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Grid.css'; // Add appropriate styling

const InventoryGrid = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch inventory data
    axios.get('https://saichaitanyamuthyala.com/inventory/fetchinventory')
      .then(response => setInventory(response.data))
      .catch(error => console.error('Error fetching inventory:', error));

    // Fetch all products
    axios.get('https://saichaitanyamuthyala.com/inventory/fetchallproducts')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  // Merge inventory with product details
  const InventoryList = inventory.map((item1) => {
    const matchingItem = products.find((item2) => item2.productID === item1.productID);
    return {
      ...item1,
      ...matchingItem, // Combine inventory and product details
    };
  });

  return (
    <div className="inventory-grid">
      <h2>Inventory</h2>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Reorder Point</th>
            <th>Units</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryGrid;
