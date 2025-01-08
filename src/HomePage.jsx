import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CampaignCard from './CampaignCard';

function HomePage() {
    const [featuredCampaigns, setFeaturedCampaigns] = useState([]);

    useEffect(() => {
        const fetchFeaturedCampaigns = async () => {
            try {
                const response = await axios.get('/featured.json');
                setFeaturedCampaigns(response.data);
            } catch (error) {
                console.error('Error fetching featured campaigns:', error);
            }
        };

        fetchFeaturedCampaigns();
    }, []);

    const renderFeaturedCampaigns = () => {
        const campaignElements = [];
        for (const campaign of featuredCampaigns) {
            campaignElements.push(
                <div key={campaign.id} className="col-md-3 mb-4">
                    <CampaignCard
                        campaignId={campaign.id}
                        campaignTitle={campaign.title}
                        campaignDescription={campaign.description}
                        campaignGoal={campaign.goal}
                        campaignRaised={campaign.raised}
                        campaignProgress={campaign.progress}
                        imageUrl={campaign.image}
                    />
                </div>
            );
        }
        return campaignElements;
    }

    return (
        <>
            <header className="text-black text-center py-5">
                <div className="container">
                    <h1 className="display-4">Support Our Causes</h1>
                    <p className="lead">Help make a difference by supporting various charity campaigns</p>
                    <a href="#" className="btn btn-primary btn-lg">Our Campaigns</a>
                </div>
            </header >

            <main className="container my-2">
                <h2 className="text-center mb-4">Featured Campaigns</h2>
                {/* Product Cards */}
                <div className="row">
                    {renderFeaturedCampaigns()}
                </div>
            </main>
        </>
    )
}

export default HomePage;