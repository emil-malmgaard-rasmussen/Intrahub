import React, {SyntheticEvent, useCallback, useEffect, useState} from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Alert, Container, Snackbar, SnackbarCloseReason} from '@mui/material';
import {Breakpoint, useTheme} from '@mui/material/styles';
import {Iconify} from '../../components/Iconify';
import {collection, getDocs, getFirestore, orderBy, query, where} from 'firebase/firestore';
import { Pagination } from '@mui/material'
import {PostItem} from '../../components/PostItem';
import {PostSearch} from './components/PostsSearch';
import {PostSort} from './components/PostSort';
import {getNetworkId} from  '../../utils/LocalStorage';
import Grid from '@mui/material/Grid2';
import {PostDrawer} from './components/PostDrawer';

const db = getFirestore();

const PostsPage = () => {
    const [sortBy, setSortBy] = useState('desc');
    const networkId = getNetworkId();
    const handleSort = useCallback((newSort: string) => {
        setSortBy(newSort);
    }, []);
    const theme = useTheme();
    const [filterName, setFilterName] = useState('');
    const [posts, setPosts] = useState<any[]>([]);
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

    const filteredPosts = posts.filter(post =>
        post.title?.toLowerCase().includes(filterName.toLowerCase())
    );

    const paginatedPosts = filteredPosts.slice((page - 1) * postsPerPage, page * postsPerPage);


    const fetchPosts = async () => {
        try {
            console.log(sortBy)
            setLoading(true);
            const postsRef = collection(db, 'POSTS');

            const postsQuery = query(
                postsRef,
                where('networkId', '==', networkId),
                orderBy('createdAt', (sortBy === 'asc' || sortBy === 'desc') ? sortBy : 'desc')
            );

            const postsSnapshot = await getDocs(postsQuery);
            const postsData = postsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            console.log(postsData);
            setPosts(postsData);
        } catch (error) {
            console.error("Error fetching documents:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
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
            }}
        >
            <Box display="flex" alignItems="center" mb={5}>
                <Typography variant="h4" flexGrow={1}>
                    Opslag
                </Typography>
                <Button
                    onClick={() => setOpen(true)}
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line"/>}
                >
                    Nyt opslag
                </Button>
            </Box>

            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{mb: 5}}>
                <PostSearch posts={posts} onSearch={handleSearch} />
                <PostSort
                    sortBy={sortBy}
                    onSort={handleSort}
                    options={[
                        {value: 'desc', label: 'Seneste'},
                        {value: 'asc', label: 'Ældste'},
                    ]}
                />
            </Box>
            <Grid container spacing={3}>
                {paginatedPosts.map((post, index) => {
                    const latestPostLarge = index === 0;
                    const latestPost = index === 1 || index === 2;

                    return (
                        <Grid key={post.id} size={{xs: 12, sm: latestPostLarge ? 12 : 6, md: latestPostLarge ? 6 : 3}}>
                            <PostItem post={post} latestPost={latestPost} latestPostLarge={latestPostLarge}/>
                        </Grid>
                    );
                })}
            </Grid>
            <Pagination
                count={Math.ceil(posts.length / postsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
                sx={{ mt: 8, mx: 'auto' }}
            />
            <PostDrawer open={open} displayDrawer={setOpen} showNotification={setNotificationOpen} />
            <Snackbar
                open={notificationOpen}
                autoHideDuration={4000}
                onClose={handleNotificationClose}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={handleNotificationClose} severity="success" variant="filled">
                    Opslaget er nu oprettet
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default PostsPage;
