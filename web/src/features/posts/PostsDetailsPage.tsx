import {useNavigate, useParams} from 'react-router-dom';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Link,
    Snackbar,
    SnackbarCloseReason,
    Stack,
    Typography,
} from '@mui/material';
import {format} from 'date-fns';
import {deletePost, fetchPost} from '../../firebase/PostQueries';
import {PostModel} from '../../firebase/models/PostModel';
import {da} from 'date-fns/locale';
import {PostsDrawer} from './components/PostsDrawer';

export const PostsDetailsPage = () => {
    const {id = ''} = useParams();
    const [post, setPost] = useState<PostModel | undefined>();
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [notificationState, setNotificationState] = useState<{ title: string, show: boolean }>({
        title: '',
        show: false
    });
    const [selectedPost, setSelectedPost] = useState<PostModel | undefined>();
    const navigate = useNavigate();

    const handleNotificationClose = (event?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setNotificationState({title: '', show: false});
    };

    const handleEditPost = () => {
        setSelectedPost(post);
        setOpen(true);
    };

    const handleDeletePost = async () => {
        const isConfirmed = window.confirm('Er du sikker på, at du vil slette dette opslag?');

        if (isConfirmed && post) {
            try {
                await deletePost(id, post.imageUrl);
                navigate('/posts', {
                    state: {
                        notificationState: {
                            show: true,
                            title: 'Opslag slettet'
                        }
                    }
                })
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        } else {
            console.log('Post deletion canceled');
        }
    }

    const handleNotificationChange = (title: string, value: boolean) => {
        setNotificationState({title, show: value});
    };

    useEffect(() => {
        setLoading(true);
        fetchPost(id).then(d => {
            setPost(d);
            setLoading(false);
        });
    }, [id, notificationState]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress/>
            </Box>
        );
    }

    if (!post) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h6">
                    Post not found with ID: <strong>{id}</strong>
                </Typography>
                <Button onClick={() => navigate('/posts')} sx={{mt: 2}}>
                    Go Back to List
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{p: 3}}>
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link
                        underline="hover"
                        color="primary"
                        onClick={() => navigate('/posts')}
                        sx={{cursor: 'pointer'}}
                    >
                        Posts
                    </Link>
                    <Typography color="text.primary">Details</Typography>
                </Breadcrumbs>
            </Stack>
            <Card
                sx={{
                    width: '100%',
                    boxShadow: 'none',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                }}
            >
                {post.imageUrl && (
                    <CardMedia
                        component="img"
                        image={post.imageUrl}
                        alt={post.title}
                        sx={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: 400,
                            objectFit: "contain",
                            backgroundColor: 'grey',
                        }}
                    />
                )}
                <CardContent sx={{p: 3}}>
                    <Typography variant="h4" gutterBottom>
                        {post.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{fontStyle: 'italic', mb: 2}}
                    >
                        {post.bio}
                    </Typography>
                    <Typography variant="body1">
                        {post.text}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" mt={3}>
                        <Typography variant="caption" color="text.secondary">
                            Oprettet: {format(post.createdAt.toDate(), 'PPPP, p', {locale: da})}
                        </Typography>
                        <Box sx={{display: 'flex', gap: 1}}>
                            <Button
                                variant="outlined"
                                onClick={handleEditPost}
                            >
                                Rediger opslag
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleDeletePost}
                            >
                                Slet opslag
                            </Button>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
            <PostsDrawer
                open={open}
                displayDrawer={setOpen}
                setNotificationsState={handleNotificationChange}
                selectedPost={selectedPost}
            />
            <Snackbar
                open={notificationState.show}
                autoHideDuration={4000}
                onClose={handleNotificationClose}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={handleNotificationClose} severity="success" variant="filled">
                    {notificationState.title}
                </Alert>
            </Snackbar>
        </Box>
    );
};
