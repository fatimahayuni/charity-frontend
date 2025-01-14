import React, { useEffect } from 'react';
import { useCart } from "./CartStore";
import { useJwt } from "./UserStore";
import axios from 'axios';

export default function ShoppingCart() {
    // Get functions and state from the cart store
    const {
        getCart,
        getCartTotal,
        addToCart,
        removeFromCart,
        fetchCart,
        isLoading,
    } = useCart();

    const cart = getCart(); // Retrieve cart from the store
    const { getJwt } = useJwt();

    // Fetch the cart data when the component mounts
    useEffect(() => {
        fetchCart();
    }, []);


    // API: Handle Checkout
    const handleCheckout = async () => {
        const jwt = getJwt();
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/checkout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            // Redirect to Stripe Checkout
            window.location.href = response.data.url;
        } catch (error) {
            console.error("Error during checkout:", error);
            alert("Checkout failed. Please try again.");
        }
    };

    return (
        <div className="container mt-4">
            <h1>Shopping Cart</h1>
            {isLoading ? (
                <p>Loading cart...</p>
            ) : cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    <ul className="list-group">
                        {cart.map((item) => {
                            return (
                                <li
                                    key={item.campaignId}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    <div>
                                        <h5>{item.campaignTitle}</h5>
                                        <img
                                            src={item.imageUrl}
                                            alt={item.campaignTitle}
                                            className="img-fluid rounded"
                                            style={{ maxWidth: "150px", maxHeight: "100px" }}
                                        />
                                    </div>

                                    {/* Donation Amount Section */}
                                    <div>
                                        <p>
                                            <strong>${item.donation_amount}</strong>
                                        </p>
                                    </div>

                                    {/* Remove Button Section */}
                                    <div>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => deleteCartItem(item.campaign_id)}
                                            disabled={isLoading}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}

            <div className="mt-3 text-end">
                <h4>Total: ${getCartTotal()}</h4>
                <button
                    className="btn btn-primary mt-2"
                    onClick={handleCheckout}
                    disabled={isLoading}
                >
                    {isLoading ? "Processing..." : "Checkout"}
                </button>
            </div>
        </div>
    );
}
