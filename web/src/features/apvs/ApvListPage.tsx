import React, {SyntheticEvent, useCallback, useEffect, useState} from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Alert, Container, Snackbar, SnackbarCloseReason} from '@mui/material';
import {Breakpoint, useTheme} from '@mui/material/styles';
import {Iconify} from '../../components/Iconify';
import {collection, getDocs, getFirestore, orderBy, query, where} from 'firebase/firestore';
import {Pagination} from '@mui/lab';
import LocalStorage from '../../utils/LocalStorage';
import Grid from '@mui/material/Grid2';
import {ApvDrawer} from './components/drawer/ApvDrawer';
import {ProjectApvItem} from './components/ProjectApvItem';
import {EmployeeApvItem} from './components/EmployeeApvItem';

const db = getFirestore();

const ApvListPage = () => {
    const [sortBy, setSortBy] = useState('desc');
    const networkId = LocalStorage.getNetworkId();
    const handleSort = useCallback((newSort: string) => {
        setSortBy(newSort);
    }, []);
    const theme = useTheme();
    const [filterName, setFilterName] = useState('');
    const [apvs, setApvs] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const postsPerPage = 10;
    const [loading, setLoading] = useState(true);
    const layoutQuery: Breakpoint = 'lg';
    const [open, setOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);

    const handleNotificationClose = (event?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setNotificationOpen(false);
    };

    const handleChangePage = (event: any, value: any) => {
        setPage(value);
    };


    const handleSearch = (newFilterName: string) => {
        setFilterName(newFilterName);
        setPage(1);
    };

    const filteredPosts = apvs.filter(post =>
        post.title?.toLowerCase().includes(filterName.toLowerCase())
    );

    const paginatedPosts = filteredPosts.slice((page - 1) * postsPerPage, page * postsPerPage);


    const fetchApvs = async () => {
        try {
            setLoading(true);
            const apvRef = collection(db, 'APV');

            const apvQuery = query(
                apvRef,
                where('networkId', '==', networkId),
                orderBy('createdAt', (sortBy === 'asc' || sortBy === 'desc') ? sortBy : 'desc')
            );

            const apvSnapshot = await getDocs(apvQuery);
            const apvsData = apvSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setApvs(apvsData);
        } catch (error) {
            console.error("Error fetching documents:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApvs();
    }, [networkId, sortBy]);

    if (loading) return <div>Loading...</div>;


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
                p: {
                    xs: 12,
                    sm: 12,
                    md: 12,
                    lg: 12,
                    xl: 12,
                },
            }}
        >
            <Box display="flex" alignItems="center" mb={5}>
                <Typography variant="h4" flexGrow={1}>
                    APV
                </Typography>
                <Button
                    onClick={() => setOpen(true)}
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line"/>}
                >
                    Opret APV
                </Button>
            </Box>
            <Grid container spacing={3}>
                {apvs.map((apv) => (
                    apv.apvType === 'employeeApv' ? (
                        <Grid key={apv.id} size={{ xs: 12, sm: 6, md: 3 }}>
                            <EmployeeApvItem apv={apv} />
                        </Grid>
                    ) : (
                        <Grid key={apv.id} size={{ xs: 12, sm: 6, md: 3 }}>
                            <ProjectApvItem apv={apv} />
                        </Grid>
                    )
                ))}
            </Grid>
            <Pagination count={10} color="primary" sx={{mt: 8, mx: 'auto'}}/>
            <ApvDrawer open={open} displayDrawer={setOpen} showNotification={setNotificationOpen}/>
            <Snackbar
                open={notificationOpen}
                autoHideDuration={4000}
                onClose={handleNotificationClose}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={handleNotificationClose} severity="success" variant="filled">
                    APV'en er nu oprettet
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default ApvListPage;
