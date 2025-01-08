import React, { useState } from 'react';
import { useCart } from './CartStore';
import { useLocation } from 'wouter';
import { useFlashMessage } from './FlashMessageStore';

const CampaignCard = (props) => {
    const { addToCart } = useCart();
    const [, setLocation] = useLocation();
    const { showMessage } = useFlashMessage();

    const [selectedDonation, setSelectedDonation] = useState(10);  // Default donation amount

    // Function to handle donation amount selection
    const handleDonationSelect = (amount) => {
        setSelectedDonation(amount);
    };

    const handleAddToCart = () => {
        const campaignData = {
            campaign_id: props.id,
            campaignName: props.campaignName,
            imageUrl: props.imageUrl,
        };

        console.log('Campaign Data being added to cart:', campaignData); // Log to check the data being passed

        addToCart(campaignData, selectedDonation); // Pass the campaign data and selected donation amount
        showMessage('Donation added to cart', 'success');
        setLocation('/cart');
    };


    return (
        <div className="col-md-12">
            <div className="card campaign-card">
                <img
                    src={props.imageUrl}
                    className="card-img-top"
                    alt={props.campaignName}
                />
                <div className="card-body">
                    <h5 className="card-title">{props.campaignName}</h5>
                    <p className="card-text">{props.campaignDescription || "This campaign aims to raise funds for various causes."}</p>

                    {/* Display predefined donation options */}
                    <div className="d-flex justify-content-between mb-3">
                        {[10, 20, 50, 100].map(amount => (
                            <button
                                key={amount}
                                className={`btn btn-outline-primary ${selectedDonation === amount ? 'active' : ''}`}
                                onClick={() => handleDonationSelect(amount)}
                            >
                                ${amount}
                            </button>
                        ))}
                    </div>

                    <div className="progress mt-3">
                        <div
                            className="progress-bar bg-palestine-red"
                            role="progressbar"
                            style={{ width: `${props.campaignProgress}%` }}  // Assuming you have this in props
                            aria-valuenow={props.campaignProgress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            {props.campaignProgress}% Raised
                        </div>
                    </div>

                    <button className="btn btn-donate mt-3 w-100" onClick={handleAddToCart}>
                        Donate ${selectedDonation}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignCard;
