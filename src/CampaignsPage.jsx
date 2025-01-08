import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CampaignCard from './CampaignCard';

function CampaignsPage() {
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/campaigns`);
                console.log(response.data);
                setCampaigns(response.data);
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            }
        };

        fetchCampaigns();
    }, []);

    return (
        <div className="container mt-5">
            <h1>The Campaigns</h1>
            <div className="row">
                {campaigns.map(campaign => (
                    <div key={campaign.campaign_id} className="col-md-4 mb-4">
                        <CampaignCard
                            id={campaign.campaign_id}
                            imageUrl={campaign.image_url}
                            campaignName={campaign.title}
                            campaignDescription={campaign.description}
                            donationAmount={campaign.current_amount}
                            campaignGoal={campaign.target_amount}
                            campaignRaised={campaign.current_amount}
                            campaignProgress={(campaign.current_amount / campaign.target_amount) * 100}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CampaignsPage;
