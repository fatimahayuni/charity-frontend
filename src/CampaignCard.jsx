import React, { useState } from 'react';
import { useCart } from './CartStore';
import { useLocation } from 'wouter';
import { useFlashMessage } from './FlashMessageStore';

const CampaignCard = ({ campaignId, campaignTitle, imageUrls = [], campaignDescription, campaignProgress }) => {


    // Clean up image URLs by trimming any leading or trailing spaces
    const cleanedImageUrls = imageUrls.map(url => url.trim());

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
            imageUrl: cleanedImageUrls[0],
            donationAmount: selectedDonation,
            pledgeId: pledgeId,
        };

        addToCart(campaignData); // Add campaign data to cart
        showMessage('Donation added to cart', 'success'); // Show success message
        setLocation('/cart'); // Navigate to the cart page
    };

    return (
        <div className="col-md-12">
            <div className="card campaign-card">
                {cleanedImageUrls && cleanedImageUrls.length > 0 ? (
                    <div id={`carousel${campaignId}`} className="carousel slide" data-bs-ride="carousel">
                        {/* Carousel Indicators */}
                        <ol className="carousel-indicators">
                            {cleanedImageUrls.map((_, index) => (
                                <li
                                    key={index}
                                    data-bs-target={`#carousel${campaignId}`}
                                    data-bs-slide-to={index}
                                    className={index === 0 ? 'active' : ''}
                                ></li>
                            ))}
                        </ol>

                        {/* Carousel Items */}
                        <div className="carousel-inner">
                            {cleanedImageUrls.map((url, index) => (
                                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <img className="d-block w-100" src={url} alt={`Slide ${index + 1}`} />
                                </div>
                            ))}
                        </div>

                        {/* Carousel Controls */}
                        <a className="carousel-control-prev" href={`#carousel${campaignId}`} role="button" data-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        </a>
                        <a className="carousel-control-next" href={`#carousel${campaignId}`} role="button" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        </a>
                    </div>
                ) : (
                    <p>No images available</p> // Fallback if no images are provided
                )}

                <div className="card-body">
                    <h5 className="card-title campaign-title">{campaignTitle}</h5>
                    <p className="card-text lato-regular">{campaignDescription || "This campaign aims to raise funds for various causes."}</p>

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
                    <button className="btn btn-donate mt-3 w-100 lato-regular" onClick={handleAddToCart}>
                        Donate ${selectedDonation}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignCard;
