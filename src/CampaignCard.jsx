import React, { useState } from 'react';
import { useCart } from './CartStore';
import { useLocation } from 'wouter';
import { useFlashMessage } from './FlashMessageStore';

const CampaignCard = ({ campaignId, campaignTitle, imageUrl, campaignDescription, campaignProgress }) => {

    const { addToCart } = useCart();
    const [, setLocation] = useLocation();
    const { showMessage } = useFlashMessage();

    const [selectedDonation, setSelectedDonation] = useState(10); // Default donation amount

    // Hardcoded pledge ID to donation amount map
    const pledgeIdMap = {
        5: 1,    // $5 donation -> pledgeId 1
        20: 2,   // $20 donation -> pledgeId 2
        50: 3,   // $50 donation -> pledgeId 3
        100: 4,  // $100 donation -> pledgeId 4
        500: 5,  // $500 donation -> pledgeId 5
        1000: 6  // $1000 donation -> pledgeId 6
    };

    // Function to handle donation amount selection
    const handleDonationSelect = (amount) => {
        setSelectedDonation(amount);
    };

    // Function to add campaign to cart
    const handleAddToCart = () => {
        const pledgeId = pledgeIdMap[selectedDonation];
        if (!pledgeId) {
            alert("Invalid donation amount selected.");
            return;
        }

        const campaignData = {
            campaignId: campaignId,
            campaignTitle: campaignTitle,
            imageUrl: imageUrl,
            donationAmount: selectedDonation,
            pledgeId: pledgeId,
        };

        // Log campaignData to verify donationAmount is set
        console.log("campaignData", campaignData); // todo showing as valid integer in donation_amount


        addToCart(campaignData); // Add campaign data to cart
        showMessage('Donation added to cart', 'success'); // Show success message
        setLocation('/cart'); // Navigate to the cart page
    };

    return (
        <div className="col-md-12">
            <div className="card campaign-card">
                <img
                    src={imageUrl}
                    className="card-img-top"
                    alt={campaignTitle}
                />
                <div className="card-body">
                    <h5 className="card-title">{campaignTitle}</h5>
                    <p className="card-text">{campaignDescription || "This campaign aims to raise funds for various causes."}</p>

                    {/* Predefined donation options */}
                    <div className="d-flex justify-content-between mb-3">
                        {[5, 20, 50, 100, 500, 1000].map((amount) => (
                            <button
                                key={amount}
                                className={`btn btn-outline-primary ${selectedDonation === amount ? 'active' : ''}`}
                                onClick={() => handleDonationSelect(amount)}
                            >
                                ${amount}
                            </button>
                        ))}
                    </div>

                    {/* Progress bar */}
                    <div className="progress mt-3">
                        <div
                            className="progress-bar bg-palestine-red"
                            role="progressbar"
                            style={{ width: `${campaignProgress || 0}%` }} // Fallback to 0 if campaignProgress is undefined
                            aria-valuenow={campaignProgress || 0}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            {campaignProgress || 0}% Raised
                        </div>
                    </div>

                    {/* Donate button */}
                    <button className="btn btn-donate mt-3 w-100" onClick={handleAddToCart}>
                        Donate ${selectedDonation}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignCard;
