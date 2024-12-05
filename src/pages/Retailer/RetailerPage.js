import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CartModal from './CartModal';
import { useNavigate } from 'react-router-dom'; 
import './Retailer.css';
import { Link } from 'react-router-dom';

const RetailerPage = () => {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [products, setProducts] = useState([]);
    const [isCartModalOpen, setCartModalOpen] = useState(false);
    const retailerID = localStorage.getItem('userId');
    const [cartItems, setCartItems] = useState(() => {
        const cartData = JSON.parse(localStorage.getItem('cartData')) || {};
        return cartData[retailerID] || [];
    });

    const openCartModal = () => {
        setCartModalOpen(true);
    };

    const closeCartModal = () => {
        setCartModalOpen(false);
    };

    const updateLocalStorage = (updatedCart) => {
        const cartData = JSON.parse(localStorage.getItem('cartData')) || {};
        cartData[retailerID] = updatedCart;
        localStorage.setItem('cartData', JSON.stringify(cartData));
    };

    const updateCartItems = (newCartItems) => {
        setCartItems(newCartItems);
        updateLocalStorage(newCartItems);
    };

    useEffect(() => {
        axios.get('https://saichaitanyamuthyala.com/inventory/fetchinventory')
            .then(response => setInventory(response.data))
            .catch(error => console.error('Error fetching inventory:', error));

        axios.get('https://saichaitanyamuthyala.com/inventory/fetchallproducts')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const InventoryList = inventory.map((item1) => {
        const matchingItem = products.find((item2) => item2.productID === item1.productID);
        return {
            ...item1,
            ...matchingItem,
        };
    });

    const addToCart = (product) => {
        const existingItem = cartItems.find((item) => item.productId === product.productID);

        let updatedCart;
        if (existingItem) {
            updatedCart = cartItems.map((item) =>
                item.productId === product.productID ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            updatedCart = [
                ...cartItems,
                {
                    productId: product.productID,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    returnable: product.returnable,
                },
            ];
        }

        setCartItems(updatedCart);
        updateLocalStorage(updatedCart);
    };

    const totalCartPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleLogOut = () => {
        navigate('/');
        // localStorage.clear();
    };

    return (
        <div className='retailerBody'>
            <div className="nav-bar">
                <div>
                    <h1>Your Retailer App</h1>
                </div>
                <div className='retailerButtons'>
                     <a href="#" className="nav-link" onClick={handleLogOut}>
                        Logout
                    </a>
                    <Link to="/orderhistory">
                        History
                    </Link>
                    <i className="fas fa-shopping-cart action-btn" onClick={openCartModal}>Cart</i>
                </div>
            </div>

            <h2 className="heading">Available Products</h2>
            <CartModal
                isOpen={isCartModalOpen}
                onClose={closeCartModal}
                cartItems={cartItems}
                updateCartItems={updateCartItems}
            />
            <div className="product-list">
                {InventoryList.map(item => {
                    const cartItem = cartItems.find(cartItem => cartItem.productId === item.productID);
                    const quantityInCart = cartItem ? cartItem.quantity : 0;
                    const isAddToCartDisabled = quantityInCart >= item.quantity || item.quantity === 0;

                    return !isAddToCartDisabled && (
                        <div key={item.productID} className={`product-card ${item.quantity === 0 ? 'disabled' : ''}`}>
                            <img src={item.imgURL} alt={item.name} className="product-img" />
                            <h3>{item.name}</h3>
                            <p>Price: ${item.price}</p>
                            <p>Quantity in Cart: {quantityInCart}</p>
                            {item.returnable === 'true' && (
                                <p className="return-text">Return available</p>
                            )}
                            <button
                                className="action-btn"
                                onClick={() => addToCart(item)}
                                disabled={isAddToCartDisabled}
                            >
                                {isAddToCartDisabled ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RetailerPage;
