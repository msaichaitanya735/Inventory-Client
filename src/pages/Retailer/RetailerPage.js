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
    const [orderHistory, setOrderHistory] = useState([]);
    const [isCartModalOpen, setCartModalOpen] = useState(false);
    const [isReturnModalOpen, setReturnModalOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    const openCartModal = () => {
        setCartModalOpen(true);
    };

    const closeCartModal = () => {
        setCartModalOpen(false);
    };

    const openReturnModal = () => {
        setReturnModalOpen(true);
    };

    const closeReturnModal = () => {
        setReturnModalOpen(false);
    };

    const updateCartItems = (newCartItems) => {
        setCartItems(newCartItems);
    };

    useEffect(() => {
        axios.get('http://localhost:8080/inventory/fetchinventory')
            .then(response => setInventory(response.data))
            .catch(error => console.error('Error fetching inventory:', error));

        axios.get('http://localhost:8080/inventory/fetchallproducts')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));

        axios.get('/api/orders/history')
            .then(response => setOrderHistory(response.data))
            .catch(error => console.error('Error fetching order history:', error));
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

        if (existingItem) {
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.productId === product.productID ? { ...item, quantity: item.quantity + 1, totalPrice: product.price * (item.quantity + 1) } : item
                )
            );
        } else {
            setCartItems((prevItems) => [
                ...prevItems,
                {
                    productId: product.productID,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    totalPrice: product.price * 1.1,
                    returnable:product.returnable,
                },
            ]);
        }
    };

    const totalCartPrice = cartItems.reduce((total, item) => total + item.totalPrice, 0);

    const handleLogOut = () => {
        navigate('/');
        localStorage.clear();
    }

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
                    {/* <a href="/orderhistory" className="nav-link" onClick={handleLogOut}>
                        History
                    </a> */}
                    <i className="fas fa-shopping-cart action-btn" onClick={openCartModal}>Cart</i>
                </div>
            </div>

            <h2 className="heading">Available Products</h2>
            <CartModal
                isOpen={isCartModalOpen}
                onClose={closeCartModal}
                cartItems={cartItems}
                totalCartPrice={Math.round(totalCartPrice * 100) / 100}
                updateCartItems={updateCartItems} 
            />
            <div className="product-list">
                {InventoryList.map(item => {
                  console.log({item})
                    const cartItem = cartItems.find(cartItem => cartItem.productId === item.productID);
                    const quantityInCart = cartItem ? cartItem.quantity : 0;
                    const isAddToCartDisabled = quantityInCart >= item.quantity || item.quantity === 0;

                    return !isAddToCartDisabled&&(
                        <div key={item.productID} className={`product-card ${item.quantity === 0 ? 'disabled' : ''}`}>
                            <img src={item.imgURL} alt={item.name} className="product-img" />
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <p>Price: ${item.price}</p>
                            <p>Quantity in Cart: {quantityInCart}</p>
                            {item.returnable == 'true' && (
                                <p className="return-text" onClick={openReturnModal}>Return available</p>
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

            {isReturnModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Return Policy</h2>
                        <p>This product has return option.</p>
                        <button onClick={closeReturnModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RetailerPage;
