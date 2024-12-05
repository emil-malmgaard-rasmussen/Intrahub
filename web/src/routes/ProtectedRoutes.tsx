import React, { useEffect, useState } from 'react';
import {Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import DashboardPage from '../features/dashboard/DashboardPage';
import Profile from '../features/profile/Profile';
import { useAuth } from '../features/auth/AuthProvider';
import { DashboardLayout } from '../features/dashboard/layout/DashboardLayout';
import ProjectsPage from '../features/projects/ProjectsPage';
import UsersPage from '../features/users/UsersPage';
import PostsPage from '../features/posts/PostsPage';
import ApvListPage from '../features/apvs/ApvListPage';
import LandingPage from '../features/landingpage/index';
import EditNetworkPage from '../features/networks/EditNetworkPage';
import { getNetworkId, setNetworkId } from '../utils/LocalStorage';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../Firebase';
import PrivacyPage from '../features/landingpage/PrivacyPage';
import Register from '../features/auth/Register';
import {CreateNetworkPage} from '../features/networks/CreateNetworkPage';
import {ApvDetailsPage} from '../features/apvs/ApvDetailsPage';
import {EmployeeApvAnswerDetailsPage} from '../features/apvs/EmployeeApvAnswerDetailsPage';
import ActivitiesListPage from '../features/activities/ActivitiesListPage';
import {CreateActionPlanDetails} from '../features/apvs/CreateActionPlanDetails';
import {ActionPlanDetails} from '../features/apvs/ActionPlanDetails';
import {PostsDetailsPage} from '../features/posts/PostsDetailsPage';

const ProtectedRoutes = () => {
    const { user } = useAuth();
    const networkId = getNetworkId();
    const [localNetworkId, setLocalNetworkId] = useState<string | null>(networkId);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleStorageChange = () => {
        const newNetworkId = getNetworkId();
        if (newNetworkId !== networkId && newNetworkId) {
            setNetworkId(newNetworkId);
            setLocalNetworkId(newNetworkId);
        }
    };

    const fetchNetwork = async () => {
        try {
            const networkRef = collection(db, 'NETWORKS');
            const q = query(
                networkRef,
                where('administrators', 'array-contains', user?.uid) || where('users', 'array-contains', user?.uid)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const fetchedNetworkId = querySnapshot.docs[0].data().id;
                setNetworkId(fetchedNetworkId);
                setLocalNetworkId(fetchedNetworkId);
            } else {
                console.warn('NO NETWORKS');
                setLocalNetworkId(null); // No network found
            }
        } catch (error) {
            console.error('Error fetching network:', error);
            setLocalNetworkId(null);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    useEffect(() => {
        if (!networkId) {
            fetchNetwork();
        } else {
            setLoading(false); // Network ID is already present
        }
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [localNetworkId]);

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!localNetworkId) {
        navigate('/create/group');
    }

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy-policy" element={<PrivacyPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create/group" element={<CreateNetworkPage />} />
            <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/activities" element={<ActivitiesListPage />} />
                <Route path="/posts" element={<PostsPage />} />
                <Route path="/posts/:id" element={<PostsDetailsPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/apvs" element={<ApvListPage />} />
                <Route path="/apvs/:id" element={<ApvDetailsPage />} />
                <Route path="/apvs/:id/employee/:uid/answers" element={<EmployeeApvAnswerDetailsPage />} />
                <Route path="/apvs/:id/create-action-plan" element={<CreateActionPlanDetails />} />
                <Route path="/apvs/:id/see-action-plan" element={<ActionPlanDetails />} />
                <Route path="/organization/settings" element={<EditNetworkPage />} />
            </Route>
        </Routes>
    );
};

export default ProtectedRoutes;
