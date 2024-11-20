import {AnalyticsWidgetSummary} from "./components/AnalyticsWidgetSummary";
import {CircularProgress, Container} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import {AnalyticsConversionRates} from "./components/AnalyticsConversionRates";
import {AnalyticsCurrentSubject} from "./components/AnalyticsCurrentSubject";
import {AnalyticsPosts} from "./components/AnalyticsPosts";
import {Breakpoint, useTheme} from '@mui/material/styles';
import {useEffect, useState} from 'react';
import {collection, getDocs, limit, query, where} from 'firebase/firestore';
import {db} from '../../Firebase';
import {getAuth} from 'firebase/auth';
import {getNetworkId} from '../../utils/LocalStorage';

const DashboardPage = () => {
    const theme = useTheme();
    const layoutQuery: Breakpoint = 'lg';
    const [documents, setDocuments] = useState<any[]>([]);
    const [network, setNetwork] = useState<any>();
    const [posts, setPosts] = useState<any[]>([]);
    const networkId = getNetworkId();
    const [loading, setLoading] = useState(true);
    const user = getAuth().currentUser;

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const documentsRef = collection(db, 'DOCUMENTS');
            const documentsQuery = query(documentsRef, where('networkId', '==', networkId));
            const documentsSnapshot = await getDocs(documentsQuery);
            const documentsData = documentsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log("Documents data:", documentsData);
            setDocuments(documentsData);
        } catch (error) {
            console.error("Error fetching documents:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNetwork = async () => {
        try {
            setLoading(true);
            const networkRef = collection(db, 'NETWORKS');
            const networkQuery = query(networkRef, where('id', '==', networkId), limit(1));
            const networkSnapshot = await getDocs(networkQuery);
            if (!networkSnapshot.empty) {
                const networkData = networkSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNetwork(networkData[0]);
            } else {
                setNetwork([]);
            }
        } catch (error) {
            console.error("Error fetching network:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const postsRef = collection(db, 'POSTS');
            const postsQuery = query(postsRef, where('networkId', '==', networkId));
            const postsSnapshot = await getDocs(postsQuery);
            const postsData = postsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(postsData);
        } catch (error) {
            console.error("Error fetching documents:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
        fetchNetwork();
        fetchPosts();
    }, [networkId]);

    return (
        <Container
            className='layout__main__content'
            maxWidth={'xl'}
            sx={{
                display: 'flex',
                flex: '1 1 auto',
                flexDirection: 'column',
                pt: 'var(--layout-dashboard-content-pt)',
                pb: 'var(--layout-dashboard-content-pb)',
                [theme.breakpoints.up(layoutQuery)]: {
                    px: 'var(--layout-dashboard-content-px)',
                },
            }}
        >
            <Typography variant="h4" sx={{mb: {xs: 3, md: 5}}}>
                Hej, velkommen {user?.displayName} 👋
            </Typography>

            {loading ? (
                <CircularProgress/>
            ) : (
                <Grid container spacing={3}>
                    <Grid size={{xs: 16, sm: 9, md: 4}}>
                        <AnalyticsWidgetSummary
                            title="Dokumenter"
                            color="primary"
                            total={documents.length}
                            icon={<img alt="icon" src="/assets/icons/dashboard/ic-glass-document.svg"/>}
                            chart={{
                                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug'],
                                series: [22, 8, 35, 50, 82, 84, 77, 12],
                            }}
                        />
                    </Grid>

                    <Grid size={{xs: 16, sm: 9, md: 4}}>
                        <AnalyticsWidgetSummary
                            title="Brugere"
                            total={network ? network.users.length : 0} // Use network data safely
                            color="secondary"
                            icon={<img alt="icon" src="/assets/icons/dashboard/ic-glass-user.svg"/>}
                            chart={{
                                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug'],
                                series: [56, 47, 40, 62, 73, 30, 23, 54],
                            }}
                        />
                    </Grid>

                    <Grid size={{xs: 16, sm: 9, md: 4}}>
                        <AnalyticsWidgetSummary
                            title="Opslag"
                            total={posts.length}
                            color="error"
                            icon={<img alt="icon" src="/assets/icons/dashboard/ic-glass-message.svg"/>}
                            chart={{
                                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug'],
                                series: [40, 70, 50, 28, 70, 75, 7, 64],
                            }}
                        />
                    </Grid>

                    <Grid size={{xs: 12, md: 6, lg: 8}}>
                        <AnalyticsConversionRates
                            title="APV Besvarelser"
                            chart={{
                                categories: ['Dec', 'Nov', 'Okt', 'Sep', 'Aug', 'Jul', 'Jun', 'Maj', 'Apr', 'Mar', 'Feb', 'Jan'],
                                series: [
                                    {name: '2022', data: []},
                                    {name: '2023', data: []},
                                ],
                            }}
                        />
                    </Grid>

                    <Grid size={{xs: 12, md: 6, lg: 4}}>
                        <AnalyticsCurrentSubject
                            title="APV besvarelser"
                            chart={{
                                categories: ['Ulykker og sikkerhed', 'Kemikalier', 'Indeklima', 'Psykisk arbejdsmiljø', 'Ergonomi', 'Støj'],
                                series: [
                                    {name: 'Series 1', data: [80, 50, 30, 40, 100, 20]},
                                    {name: 'Series 2', data: [20, 30, 40, 80, 20, 80]},
                                    {name: 'Series 3', data: [44, 76, 78, 13, 43, 10]},
                                ],
                            }}
                        />
                    </Grid>

                    <Grid size={{xs: 12, md: 6, lg: 8}}>
                        <AnalyticsPosts title="Opslag" list={posts.slice(0, 5)}/>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
}

export default DashboardPage;
