import React from 'react';
import { useCart } from './CartStore';

const ShoppingCart = () => {
    const { cart, getCartTotal, removeFromCart } = useCart();
    console.log("Cart", cart)
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
                                    >
                                        Remove
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
