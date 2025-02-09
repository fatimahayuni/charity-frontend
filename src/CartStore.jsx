import { atom, useAtom } from 'jotai';
import Immutable from "seamless-immutable";
import { useEffect } from "react";
import { useJwt } from "./UserStore";

// Define the initial state of the cart.
const initialCart = Immutable([]);

// Create an atom for the cart
export const cartAtom = atom(initialCart);
export const cartLoadingAtom = atom(false);

const camelToSnake = (str) => {
    if (typeof str !== 'string') {
        console.error('Expected a string, but got:', str);
        return str;
    }
    return str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
};

const snakeToCamel = (str) => {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

// Custom hook for cart operations
export const useCart = () => {
    const [cart, setCart] = useAtom(cartAtom);
    const [isLoading, setIsLoading] = useAtom(cartLoadingAtom);
    const { getJwt } = useJwt();

    const addToCart = (campaignData) => {
        try {
            const newItem = {
                id: crypto.randomUUID(),
                campaign_id: campaignData.campaignId,
                campaign_title: campaignData.campaignTitle,
                image_url: campaignData.imageUrl,
                donation_amount: campaignData.donationAmount,
                pledge_id: campaignData.pledgeId,
                added_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
            };

            // Store the new item in the localStorage cart array
            const updatedCart = [...cart, newItem];
            setCart(Immutable(updatedCart));

            // Save the updated cart to localStorage
            localStorage.setItem('cart', JSON.stringify(updatedCart));

            console.log("Added to cart:", newItem);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const updateCart = () => {
        setIsLoading(true);
        try {
            // Save the updated cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (error) {
            console.error("Error updating cart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch cart from localStorage
    const fetchCart = () => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);

            // Convert snake_case keys to camelCase
            const camelCasedData = parsedCart.map((item) => {
                const camelCasedItem = {};
                for (const key in item) {
                    if (item.hasOwnProperty(key)) {
                        camelCasedItem[snakeToCamel(key)] = item[key];
                    }
                }
                return camelCasedItem;
            });

            setCart(Immutable(camelCasedData)); // Set the cart state with converted data
        } else {
            console.log("No cart found in localStorage.");
        }
    };

    useEffect(() => {
        fetchCart(); // Fetch cart from localStorage when component mounts
    }, []);

    const removeFromCart = (id) => {
        setCart((currentCart) => {
            const updatedCart = currentCart.filter(item => item.id !== id);
            localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save updated cart
            return Immutable(updatedCart);
        });
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => {
            const donationAmount = item.donationAmount;
            if (!isNaN(donationAmount)) {
                total += donationAmount;
            } else {
                console.log("Donation amount is not valid:", donationAmount);
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
        updateCart,
        isLoading
    };
};
