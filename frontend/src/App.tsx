import React from 'react';
import AppRoutes from './Routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { Toaster } from 'sonner';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const App: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <Toaster position="top-right" richColors closeButton />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Elements>
  );
};

export default App;
