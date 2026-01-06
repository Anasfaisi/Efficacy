import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App';
import { Providers } from './redux/Provider';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId={clientId}>
        <StrictMode>
            <Providers>
                <App />
            </Providers>
        </StrictMode>
    </GoogleOAuthProvider>,
);
