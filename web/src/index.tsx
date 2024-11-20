import React from 'react';
import ReactDOM from 'react-dom/client'; // Use ReactDOM from the 'react-dom/client' module in React 18+
import App from './App'; // Adjust the path if your App component is in a different folder
import './index.css'; // Import your global styles, if you have any
import {AuthProvider} from './features/auth/AuthProvider';

// Create a root element
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Render the App component
root.render(
    <React.StrictMode>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </React.StrictMode>
);
