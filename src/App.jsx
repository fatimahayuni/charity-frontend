import React, { useEffect } from 'react';
import Navbar from './Navbar';
import HomePage from './HomePage';
import CampaignsPage from './CampaignsPage';
import RegisterPage from './RegisterPage';
import ShoppingCart from './ShoppingCart';
import { Route, Switch } from 'wouter';
import { useFlashMessage } from './FlashMessageStore';
import UserLogin from "./UserLogin"
import PaymentSuccess from './PaymentSuccess';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
    const { getMessage, clearMessage } = useFlashMessage();
    const flashMessage = getMessage();

    useEffect(() => {
        const timer = setTimeout(() => {
            clearMessage();
        }
            , 3000);
        return () => {
            clearTimeout(timer);
        };
    }, [flashMessage]);

    return (
        <>
            <Navbar />
            {flashMessage.message && (
                <div className={`alert alert-${flashMessage.type} text-center flash-alert`} role="alert">
                    {flashMessage.message}
                </div>
            )}
            <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/campaigns" component={CampaignsPage} />
                <Route path="/register" component={RegisterPage} />
                <Route path="/login" component={UserLogin} />
                <Route path="/cart" component={ShoppingCart} />
                <Route path="/payment-success" component={PaymentSuccess} />
            </Switch>

            <footer className="text-center py-4" style={{ backgroundColor: '#333', color: 'white' }}>
                <div className="container">
                    <p>&copy; 2024 MPWU Crowdfunding | All rights reserved.</p>
                    <p>Follow us on:</p>
                    <div>
                        <a href="#" className="text-black me-3">Facebook</a>
                        <a href="#" className="text-black me-3">Twitter</a>
                        <a href="#" className="text-black me-3">Instagram</a>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default App;
