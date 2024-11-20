import React, {useEffect, useState} from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import DashboardPage from '../features/dashboard/DashboardPage';
import Profile from '../features/profile/Profile';
import {useAuth} from '../features/auth/AuthProvider';
import {DashboardLayout} from '../features/dashboard/layout/DashboardLayout';
import ProjectsPage from '../features/projects/ProjectsPage';
import UsersPage from '../features/users/UsersPage';
import PostsPage from '../features/posts/PostsPage';
import LocalStorage from '../utils/LocalStorage';
import ApvListPage from '../features/apvs/ApvListPage';
import {ProjectApvDetailsPage} from '../features/apvs/ProjectApvDetailsPage';
import LandingPage from '../features/landingpage/index';
import EditOrganizationPage from '../features/organizations/EditOrganizationPage';
import { EmployeeApvDetailsPage } from '../features/apvs/EmployeeApvDetailsPage';

const ProtectedRoutes = () => {
    const { user } = useAuth();
    const [networkId, setNetworkId] = useState(LocalStorage.getNetworkId());

    const handleStorageChange = () => {
        const newNetworkId = LocalStorage.getNetworkId();
        if (newNetworkId !== networkId) {
            setNetworkId(newNetworkId);
        }
    };

    useEffect(() => {
        console.log("called")
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [networkId])

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
                element={
                    <DashboardLayout />
                }
            >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/posts" element={<PostsPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/apvs" element={<ApvListPage />} />
                <Route path="/apvs/project/:id" element={<ProjectApvDetailsPage />} />
                <Route path="/apvs/employee/:id" element={<EmployeeApvDetailsPage />} />
                <Route path="/organization/settings" element={<EditOrganizationPage />} />
            </Route>
        </Routes>
    );
};

export default ProtectedRoutes;
