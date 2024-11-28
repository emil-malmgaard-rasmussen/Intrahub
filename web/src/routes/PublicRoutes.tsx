import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import LandingPage from '../features/landingpage/index';
import PrivacyPage from '../features/landingpage/PrivacyPage';

const PublicRoutes = () => (
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />
    </Routes>
);

export default PublicRoutes;
