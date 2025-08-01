import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { store } from './redux/store';
// import { setupAxiosInterceptors } from './axiosConfig';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store ={store}>
      
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)