import React, {SyntheticEvent, useEffect, useState} from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Alert, Container, Snackbar, SnackbarCloseReason} from '@mui/material';
import {Breakpoint, useTheme} from '@mui/material/styles';
import {Iconify} from '../../components/Iconify';
import {collection, getDocs, getFirestore, orderBy, query, where} from 'firebase/firestore';
import {Pagination} from '@mui/lab';
import Grid from '@mui/material/Grid2';
import {ApvDrawer} from './components/drawer/ApvDrawer';
import {ProjectApvItem} from './components/ProjectApvItem';
import {EmployeeApvItem} from './components/EmployeeApvItem';
import { getNetworkId } from '../../utils/LocalStorage';

const db = getFirestore();

const ApvListPage = () => {
    const networkId = getNetworkId();
    const theme = useTheme();
    const [apvs, setApvs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const layoutQuery: Breakpoint = 'lg';
    const [open, setOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);

    const handleNotificationClose = (event?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setNotificationOpen(false);
    };

    const fetchApvs = async () => {
        try {
            setLoading(true);
            const apvRef = collection(db, 'APV');

            const apvQuery = query(
                apvRef,
                where('networkId', '==', networkId),
                orderBy('createdAt', 'desc')
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
    }, [networkId]);

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
                        <Grid key={apv.id} size={{xs: 12, sm: 6, md: 3}}>
                            <EmployeeApvItem apv={apv}/>
                        </Grid>
                    ) : (
                        <Grid key={apv.id} size={{xs: 12, sm: 6, md: 3}}>
                            <ProjectApvItem apv={apv}/>
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
