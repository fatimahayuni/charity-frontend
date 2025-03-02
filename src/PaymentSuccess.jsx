import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartStore';


const PaymentSuccess = () => {
    const { setCart } = useCart();
    const [order, setOrder] = useState(null);
    const [campaignProgress, setCampaignProgress] = useState(0);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('orderId');
    // const { setCart } = useCart();

    // Define an async function for fetching order details
    const fetchOrderDetails = async () => {
        if (orderId) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`);
                console.log('Response Data:', response.data);

                if (response.data) {
                    setOrder(response.data); // Set the order data

                    // Ensure campaignProgress is part of the response and set it
                    const progress = response.data.campaignProgress !== undefined
                        ? response.data.campaignProgress
                        : 0;
                    setCampaignProgress(progress); // Set campaign progress 
                }
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        }
    };

    // Function to clear the cart from localStorage
    const clearCart = () => {
        localStorage.removeItem('cart');
        setCart([]);
    };


    useEffect(() => {
        fetchOrderDetails();
        clearCart();
    }, [orderId]);

    return (
        <div>
            <h1>Thank you for your donation!</h1>
            {order ? (
                <div>
                    <p>Your donation has been successfully processed.</p>
                    <p>Order ID: {order.id}</p>
                    <div>
                        <h3>Campaign Progress</h3>
                        <progress value={campaignProgress} max="100"></progress>
                        <p>{campaignProgress}% of the goal achieved!</p>
                    </div>
                </div>
            ) : (
                <p>Loading payment details...</p>
            )}
        </div>
    );
};

export default PaymentSuccess;
