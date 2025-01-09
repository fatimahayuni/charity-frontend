import React, { useState, useEffect, useRef } from 'react';
import { useCart } from './CartStore';
import { useJwt } from './UserStore';
import axios from 'axios';

const ShoppingCart = () => {
    const { cart, getCartTotal, removeFromCart, setCartContent } = useCart();
    const { getJwt } = useJwt();
    const [isUpdating, setIsUpdating] = useState(false);
    const isFirstRender = useRef(true); // Track first render

    const fetchCart = async () => {
        const jwt = getJwt();
        try {
            const response = await axios.get(import.meta.env.VITE_API_URL + '/api/cart', {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
            console.log('Cart:', response.data);
            setCartContent(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    useEffect(() => {
        fetchCart();
        return () => { console.log('cleanup') }
    }, []);

    const updateCart = async () => {
        setIsUpdating(true);
        const jwt = getJwt();
        try {
            const updatedCart = cart.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity
            }));

            await axios.put(import.meta.env.VITE_API_URL + '/api/cart', { cartItems: updatedCart }, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
        } catch (error) {
            console.error('Error updating cart:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return; // Skip the first render
        }
        updateCart();
        return () => { console.log('cleanup') }
    }, [cart]);

    return (
        <div className="container mt-4">
            <h2>Your Donations</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <ul className="list-group">
                        {cart.map((item) => (
                            <li
                                key={item.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <h5>{item.campaign_name}</h5>
                                    <p>{item.description}</p>
                                    <img
                                        src={item.image_url}
                                        alt={item.campaign_name}
                                        className="img-fluid rounded"
                                        style={{ maxWidth: '150px', maxHeight: '100px' }}
                                    />
                                </div>
                                <div className="text-end">
                                    <p className="mb-2">${item.donation_amount}</p>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => removeFromCart(item.campaign_id)}
                                        disabled={isUpdating}
                                    >Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3 text-end">
                        <h4>Total Donation: ${getCartTotal()}</h4>
                    </div>
                </>
            )}
        </div>
    );
};

export default ShoppingCart;
