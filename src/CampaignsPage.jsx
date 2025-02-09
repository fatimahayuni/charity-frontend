import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CampaignCard from './CampaignCard';

function CampaignsPage() {
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const apiUrl = `${import.meta.env.VITE_API_URL}/api/campaigns`;
                const response = await axios.get(apiUrl);
                setCampaigns(response.data);
            } catch (error) {
                console.error('Error fetching campaigns:', error);
                console.error('Full error:', error);

            }
        };

        fetchCampaigns();
    }, []);

    return (
        <div className="container mt-5">
            <h1>The Campaigns</h1>
            <div className="row">
                {campaigns.map(campaign => {
                    return (
                        <div key={campaign.campaign_id} className="col-md-4 mb-4">
                            <CampaignCard
                                campaignId={campaign.campaign_id}
                                imageUrl={campaign.image_url?.split(',')[0]} // Use the first image URL
                                imageUrls={campaign.image_url?.split(',')} // Pass all URLs as an array (if needed)                                
                                campaignTitle={campaign.campaign_name}
                                campaignDescription={campaign.campaign_description}
                                donationAmount={campaign.current_amount}
                                campaignGoal={campaign.target_amount}
                                campaignRaised={campaign.current_amount}
                                campaignProgress={(campaign.current_amount / campaign.target_amount) * 100}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CampaignsPage;
