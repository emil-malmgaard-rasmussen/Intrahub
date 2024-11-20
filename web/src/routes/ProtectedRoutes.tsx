import React, {useEffect, useState} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import DashboardPage from '../features/dashboard/DashboardPage';
import Profile from '../features/profile/Profile';
import {useAuth} from '../features/auth/AuthProvider';
import {DashboardLayout} from '../features/dashboard/layout/DashboardLayout';
import ProjectsPage from '../features/projects/ProjectsPage';
import UsersPage from '../features/users/UsersPage';
import PostsPage from '../features/posts/PostsPage';
import ApvListPage from '../features/apvs/ApvListPage';
import {ProjectApvDetailsPage} from '../features/apvs/ProjectApvDetailsPage';
import LandingPage from '../features/landingpage/index';
import EditOrganizationPage from '../features/organizations/EditOrganizationPage';
import {EmployeeApvDetailsPage} from '../features/apvs/EmployeeApvDetailsPage';
import {getNetworkId, setNetworkId} from '../utils/LocalStorage';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {db} from '../Firebase';

const ProtectedRoutes = () => {
    const {user} = useAuth();
    const networkId = getNetworkId()
    const [localNetworkId, setLocalNetworkId] = useState<string | null>(networkId);
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
                where("administrators", "array-contains", user?.uid) || where('users', 'array-contains', user?.uid));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setNetworkId(querySnapshot.docs[0].data().id)
            } else {
                console.warn("NO NETWORKS");
                return [];
            }
        } catch (error) {
            console.error("Error fetching network:", error);
            return [];
        }
    };

    useEffect(() => {
        if (!networkId) {
            fetchNetwork();
        }
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [localNetworkId])

    if (!user) {
        return <Navigate to="/login"/>;
    }

    return (
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route
                element={
                    <DashboardLayout/>
                }
            >
                <Route path="/dashboard" element={<DashboardPage/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/projects" element={<ProjectsPage/>}/>
                <Route path="/posts" element={<PostsPage/>}/>
                <Route path="/users" element={<UsersPage/>}/>
                <Route path="/apvs" element={<ApvListPage/>}/>
                <Route path="/apvs/project/:id" element={<ProjectApvDetailsPage/>}/>
                <Route path="/apvs/employee/:id" element={<EmployeeApvDetailsPage/>}/>
                <Route path="/organization/settings" element={<EditOrganizationPage/>}/>
            </Route>
        </Routes>
    );
};

export default ProtectedRoutes;
