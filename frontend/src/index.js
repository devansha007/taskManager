import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AuthProvider from './context/AuthContext';
import ToastProvider from './context/ToastContext'; 
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>        
     <ToastProvider>      
      <App />
    </ToastProvider>
    </AuthProvider>       
  </React.StrictMode>
);

reportWebVitals();