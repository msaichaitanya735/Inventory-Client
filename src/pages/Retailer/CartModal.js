import React, { useEffect, useState } from 'react';
import './CartModal.css';
import { Link } from 'react-router-dom';

const CartModal = ({ isOpen, onClose, cartItems, totalCartPrice, updateCartItems }) => {
    const [localCartItems, setLocalCartItems] = useState([]);

    useEffect(() => {
        setLocalCartItems(cartItems);
    }, [cartItems]);

    const handleRemoveFromCart = (item) => {
        const updatedCart = localCartItems.filter((cartItem) => cartItem.productId !== item.productId);
        setLocalCartItems(updatedCart);
        updateCartItems(updatedCart);
    };

    const handleAddQuantity = (item) => {
        const updatedCart = localCartItems.map((cartItem) => {
            if (cartItem.productId === item.productId) {
                return { ...cartItem, quantity: cartItem.quantity + 1 };
            }
            return cartItem;
        });
        setLocalCartItems(updatedCart);
        updateCartItems(updatedCart);
    };

    const handleReduceQuantity = (item) => {
        const updatedCart = localCartItems
            .map((cartItem) => {
                if (cartItem.productId === item.productId && cartItem.quantity > 1) {
                    return { ...cartItem, quantity: cartItem.quantity - 1 };
                }
                return cartItem;
            })
            .filter(cartItem => cartItem.quantity > 0);
        setLocalCartItems(updatedCart);
        updateCartItems(updatedCart);
    };

    return (
        <div className={`cart-modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Shopping Cart</h2>
                <ul>
                    {localCartItems.length ? localCartItems.map((item, index) => (
                        <div className='item' key={index}>
                            <div className='itemlist'>
                                <p>{item.name}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: ${item.price * item.quantity}</p>
                                <p>
                                    <button onClick={() => handleAddQuantity(item)}>+</button>
                                    <button onClick={() => handleReduceQuantity(item)}>-</button>
                                    <button onClick={() => handleRemoveFromCart(item)}>Remove</button>
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div className='item'>
                            <div className='itemlist'>
                                <p>No items in the cart</p>
                            </div>
                        </div>
                    )}
                </ul>
                <div className="cart-total">
                    <p>Total Price: ${totalCartPrice}</p>
                </div>
                <Link to="/payment">
                    <button onClick={() => localStorage.setItem('cartItems', JSON.stringify(localCartItems))}>
                        Proceed to Payment
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default CartModal;
