import { atom, useAtom } from 'jotai';
import Immutable from "seamless-immutable";


// Define the initial state of the cart. We put in one piece of test data
const initialCart = Immutable([]);

// Create an atom for the cart
export const cartAtom = atom(initialCart);

// Custom hook for cart operations
export const useCart = () => {
    const [cart, setCart] = useAtom(cartAtom);

    // Function to calculate the total price of items in the cart
    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.donation_amount, 0);
    };

    const addToCart = (campaign, selectedDonation) => {
        setCart((currentCart) => {
            const existingItemIndex = currentCart.findIndex(item => item.campaign_id === campaign.campaign_id);

            if (existingItemIndex !== -1) {
                // If the campaign already exists in the cart, do nothing (or update if needed)
                return currentCart;
            } else {
                // Using `setIn` to maintain immutability in the cart state
                return currentCart.concat({
                    campaign_id: campaign.campaignId,
                    campaign_name: campaign.campaignTitle,
                    image_url: campaign.imageUrl,
                    donation_amount: selectedDonation,
                });
            }
        });
    };

    const removeFromCart = (campaign_id) => {
        setCart((currentCart) => {
            return currentCart.filter(item => item.campaign_id !== campaign_id);
        });
    }


    return {
        cart,
        getCartTotal,
        addToCart,
        removeFromCart
    };
};