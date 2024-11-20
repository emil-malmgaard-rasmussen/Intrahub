import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import ProtectedRoutes from './routes/ProtectedRoutes';
import PublicRoutes from './routes/PublicRoutes';
import {useAuth} from './features/auth/AuthProvider';
import {ThemeProvider} from './theme/ThemeProvider';

function App() {
    const {user} = useAuth();
    return (
        <ThemeProvider>
            <Router>
                {user ? <ProtectedRoutes/> : <PublicRoutes/>}
            </Router>
        </ThemeProvider>
    );
}

export default App;
