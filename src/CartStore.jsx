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
            // Convert camelCase keys to snake_case for the backend
            const updatedCartItems = cart.map((item) => {
                const snakeCasedItem = {};
                for (const key in item) {
                    if (item.hasOwnProperty(key)) {
                        // Convert the key (camelCase to snake_case) but keep the value unchanged
                        snakeCasedItem[camelToSnake(key)] = item[key];
                    }
                }
                return snakeCasedItem;
            });


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

    const addToCart = (campaignData) => {
        console.log("Selected donation value before adding to cart:", campaignData.donationAmount);

        setCart((currentCart) => {
            const existingItemIndex = currentCart.findIndex(item => item.campaign_id === campaignData.campaignId);

            if (existingItemIndex !== -1) {
                // If the campaign already exists in the cart, do nothing (or update if needed)
                return currentCart;
            } else {
                // Create the new item to add to the cart with added_at timestamp
                const newItem = {
                    campaign_id: campaignData.campaignId,
                    campaign_title: campaignData.campaignTitle,
                    image_url: campaignData.imageUrl,
                    donation_amount: campaignData.donationAmount,
                    pledge_id: campaignData.pledgeId || null,  // Optional, only if available
                    added_at: new Date().toISOString().slice(0, 19).replace('T', ' ')  // MySQL format: 'YYYY-MM-DD HH:MM:SS'
                };

                // Log the new item
                console.log("New item added to cart:", newItem);
                return currentCart.concat(newItem);
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