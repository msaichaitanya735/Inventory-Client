import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddProductModal.css';
import AddProductModalInventory from './AddProductModalInventory';

const AddProductModal = ({ onAdd, onClose }) => {
    const [products, setProducts] = useState([]);
    const [inputs, setInputs] = useState({});

    useEffect(() => {
        // Fetch inventory data from the backend
        axios.get('https://saichaitanyamuthyala.com/inventory/getproductsnotininventory')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const handleInputChange = (productId, field, value) => {
        setInputs(prevInputs => ({
            ...prevInputs,
            [productId]: {
                ...prevInputs[productId],
                [field]: value
            }
        }));
    };

    const handleAddProduct = (productId) => {
        const { reorderpoint, price, units } = inputs[productId] || { reorderpoint: '0', price: '0', units: '' };
        const api = `https://saichaitanyamuthyala.com/inventory/addproducttoinventory?productId=${productId}&price=${price}&reorderPoint=${reorderpoint}&units=${units}`;
        axios.post(api)
            .then(response => {
                console.log('Product added:', response.data);
                // Optionally call onAdd() to refresh the inventory list in parent component
                if (onAdd) onAdd();
            })
            .catch(error => console.error('Error adding product to inventory:', error))
            .finally(() => {
                setInputs(prevInputs => ({
                    ...prevInputs,
                    [productId]: {
                        reorderpoint: '0',
                        price: '0',
                        units: ''
                    }
                }));
                window.location.reload();
            });
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Add Products to Inventory</h2>
                <div className="product-list">
                    {products.map(product => {
                        const { reorderpoint = '0', price = '0', units = '' } = inputs[product.productID] || {};
                        return (
                            <div key={product.productID} className="product-card">
                                <img src={product.imgURL} alt={product.name} />
                                <h3>{product.name}</h3>
                                <label>Reorder Points</label>
                                <input
                                    type="number"
                                    id="reorderpoints"
                                    style={{ width: '35%', padding: '8px', marginBottom: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    name="reorderpoints"
                                    value={reorderpoint}
                                    onChange={(e) => handleInputChange(product.productID, 'reorderpoint', e.target.value)}
                                />
                                <label>Price</label>
                                <input
                                    type="number"
                                    id="price"
                                    style={{ width: '35%', padding: '8px', marginBottom: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    name="price"
                                    value={price}
                                    onChange={(e) => handleInputChange(product.productID, 'price', e.target.value)}
                                />
                                <label>Units of Measure</label>
                                <select
                                    id="units"
                                    style={{ width: '100%', padding: '8px', marginBottom: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    name="units"
                                    value={units}
                                    onChange={(e) => handleInputChange(product.productID, 'units', e.target.value)}
                                >
                                    <option value="Kgs">Kgs</option>
                                    <option value="Per Piece">Per Piece</option>
                                    <option value="Lbs">Lbs</option>
                                    <option value="Dozen">Dozen</option>
                                    <option value="Liter">Liter</option>
                                </select>
                                <button onClick={() => handleAddProduct(product.productID)}>Add</button>
                            </div>
                        );
                    })}
                </div>
                <button className="close-btn" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default AddProductModal;
