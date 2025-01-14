import { atom, useAtom } from 'jotai';
import axios from 'axios';
import Immutable from "seamless-immutable";
import { useEffect } from "react";
import { useJwt } from "./UserStore";

// Define the initial state of the cart. We put in one piece of test data
const initialCart = Immutable([]);

// Create an atom for the cart
export const cartAtom = atom(initialCart);
export const cartLoadingAtom = atom(false);

// Custom hook for cart operations
export const useCart = () => {
    const [cart, setCart] = useAtom(cartAtom);
    const [isLoading, setIsLoading] = useAtom(cartLoadingAtom);
    const { getJwt } = useJwt();

    const camelToSnake = (str) => {
        // Check if str is a string before applying the regex replace
        if (typeof str !== 'string') {
            console.error('Expected a string, but got:', str);
            return str;  // Return the original value if it's not a string
        }
        return str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
    };


    const updateCart = async () => {
        const jwt = getJwt();
        setIsLoading(true);
        try {
            // Convert camelCase keys to snake_case before sending the data to the backend
            const updatedCartItems = cart.map((item) => ({
                id: item.id,  // Keep `id` as it is (no conversion needed)
                campaign_id: camelToSnake(item.campaignId),  // Convert `campaignId` to `campaign_id`
                campaign_title: camelToSnake(item.campaignTitle),  // Convert `campaignTitle` to `campaign_title`
                image_url: camelToSnake(item.imageUrl),  // Convert `imageUrl` to `image_url`
                donation_amount: camelToSnake(item.donationAmount),  // Convert `donationAmount` to `donation_amount`
                added_at: camelToSnake(item.addedAt),  // Convert `addedAt` to `added_at`
            }));

            console.log("Sending Cart Items (snake_case):", updatedCartItems);

            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/cart`,
                { cartItems: updatedCartItems },
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            console.log("Server response:", response);
        } catch (error) {
            console.error("Error updating cart:", error.response?.data || error);
        } finally {
            setIsLoading(false);
        }
    };




    // Update cart on the backend whenever the cart changes
    useEffect(() => {
        if (cart !== initialCart) {
            updateCart();
        }
    }, [cart]); // Depend on the cart state

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
                    campaign_title: campaign.campaignTitle,
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

    const snakeToCamel = (str) => {
        return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
    };


    const fetchCart = async () => {
        const jwt = getJwt();
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/cart`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            console.log("Server response:", response.data);

            // Convert snake_case keys to camelCase for each item in the cart
            const camelCasedData = response.data.map((item) => {
                const camelCasedItem = {};
                for (const key in item) {
                    if (item.hasOwnProperty(key)) {
                        // Convert key to camelCase
                        camelCasedItem[snakeToCamel(key)] = item[key];
                    }
                }
                console.log("camelCasedItem: ", camelCasedItem)
                return camelCasedItem;
            });

            setCart(Immutable(camelCasedData)); // Set the cart state with converted data
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setIsLoading(false);
        }
    };


    // Function to calculate the total price of items in the cart
    const getCartTotal = () => {
        return cart.reduce((total, item) => {
            // Parse donation_amount as a number (float) before adding it to the total
            const donationAmount = parseFloat(item.donation_amount);
            // Add only if donation_amount is a valid number
            if (!isNaN(donationAmount)) {
                total += donationAmount;
            }
            return total;
        }, 0);
    };

    const getCart = () => cart;

    return {
        getCart,
        getCartTotal,
        addToCart,
        removeFromCart,
        fetchCart,
        isLoading
    };
};