import Box from '@mui/material/Box';
import {Button, CircularProgress, Drawer, IconButton, TextField, Typography} from '@mui/material';
import {useForm} from 'react-hook-form';
import {ChangeEvent, useEffect, useState} from 'react';
import {useTheme} from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import {getAuth} from 'firebase/auth';
import {getNetworkId} from '../../../utils/LocalStorage';
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';
import {deleteObject, getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {db, storage} from '../../../Firebase';
import Divider from '@mui/material/Divider';
import {Iconify} from '../../../components/Iconify';
import Badge from '@mui/material/Badge';
import {PostModel} from '../../../firebase/models/PostModel';
import {updatePost} from '../../../firebase/PostQueries';
import {useParams} from 'react-router-dom';

export interface PostDrawerProps {
    open: boolean;
    displayDrawer: (value: boolean) => void;
    setNotificationsState: (title: string, value: boolean) => void;
    selectedPost?: PostModel;
}

export const PostsDrawer = (props: PostDrawerProps) => {
    const theme = useTheme();
    const {open, displayDrawer, setNotificationsState, selectedPost} = props;
    const {register, handleSubmit, watch, reset} = useForm();
    const titleWatch = watch('title');
    const bioWatch = watch('bio');
    const textWatch = watch('text');
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const networkId = getNetworkId();
    const {id = ''} = useParams();

    const handleResetFilter = () => {
        reset();
    }

    const canReset = () => {
        return Boolean(titleWatch?.length || bioWatch?.length || textWatch?.length);
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setFile(file);
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            const result = fileReader.result;
            if (typeof result === 'string') {
                setPreview(result);
            }
        };
        fileReader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setPreview(null);
        setFile(null)
    };

    const handleUpdatePost = async (data: any) => {
        setUploading(true);
        let imageUrl =  preview;

        if (file) {
            if (selectedPost!.imageUrl) {
                try {
                    const oldImagePath = selectedPost!.imageUrl.split('/o/')[1]?.split('?')[0]?.replace(/%2F/g, '/');
                    const oldImageRef = ref(storage, decodeURIComponent(oldImagePath));
                    await deleteObject(oldImageRef);
                } catch (error) {
                    console.error('Error deleting old image: ', error);
                }
            }

            const imageRef = ref(storage, `posts/${networkId}/${Date.now()}`);
            try {
                await uploadBytes(imageRef, file);
                imageUrl = await getDownloadURL(imageRef);
            } catch (error) {
                console.error('Error uploading image: ', error);
            }
        }

        if(selectedPost!.imageUrl && !preview) {
            try {
                const oldImagePath = selectedPost!.imageUrl.split('/o/')[1]?.split('?')[0]?.replace(/%2F/g, '/');
                const oldImageRef = ref(storage, decodeURIComponent(oldImagePath));
                await deleteObject(oldImageRef);
                imageUrl = '';
            } catch (error) {
                console.error('Error deleting old image: ', error);
            }
        }

        data.imageUrl = imageUrl;

        await updatePost(data, id);
        setNotificationsState('Opslaget er nu opdateret', true);
        displayDrawer(false);
    };

    const onSubmit = async (data: any) => {
        if (selectedPost) {
            await handleUpdatePost(data);
            return;
        }
        const user = getAuth().currentUser;
        if (!user) return;

        const uid = user.uid;
        setUploading(true);
        let imageUrl = preview;

        if (file) {
            const imageRef = ref(storage, `posts/${networkId}/${Date.now()}`);
            try {
                await uploadBytes(imageRef, file);
                imageUrl = await getDownloadURL(imageRef);
            } catch (error) {
                console.error('Error uploading image: ', error);
            }
        }

        try {
            await addDoc(collection(db, 'POSTS'), {
                title: data.title,
                bio: data.bio,
                text: data.text,
                imageUrl,
                uid,
                networkId,
                createdAt: serverTimestamp(),
            });
            setNotificationsState('Opslaget er nu oprettet', true);
            reset();
        } catch (error) {
            console.error('Error adding document: ', error);
        } finally {
            setUploading(false);
            displayDrawer(false);
        }
    };

    useEffect(() => {
        if (selectedPost) {
            reset({
                title: selectedPost.title,
                bio: selectedPost.bio,
                text: selectedPost.text,
            });
            if (selectedPost.imageUrl) {
                setPreview(selectedPost.imageUrl);
            }
        } else {
            reset({
                title: '',
                bio: '',
                text: '',
            });
            setPreview(null);
            setFile(null);
        }
    }, [selectedPost, reset]);

    return (
        <Drawer open={open} onClose={() => displayDrawer(false)} anchor={'right'}>
            <Box
                sx={{
                    width: 400,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Box display="flex" alignItems="center" sx={{pl: 2.5, pr: 1.5, py: 2}}>
                    <Typography variant="h6" flexGrow={1}>
                        Opret opslag
                    </Typography>
                    <IconButton onClick={handleResetFilter}>
                        <Badge color="error" variant="dot" invisible={!canReset()}>
                            <Iconify icon="solar:refresh-linear"/>
                        </Badge>
                    </IconButton>
                    <IconButton onClick={() => displayDrawer(false)}>
                        <Iconify icon="mingcute:close-line"/>
                    </IconButton>
                </Box>
                <Divider/>
                <Box sx={{pl: 2.5, pr: 1.5, py: 2}}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{mb: 3, display: 'flex', flexDirection: 'column'}}>
                            <TextField
                                sx={{width: '100%'}}
                                {...register('title', {maxLength: 50})}
                                label={'Titel'}
                                variant="outlined"
                                placeholder="max 50 tegn"
                            />
                            <Box
                                sx={{
                                    padding: '2px 8px',
                                    fontSize: '0.8rem',
                                    alignSelf: 'flex-end',
                                }}
                            >
                                <Typography variant="caption" component="span"
                                            sx={{color: titleWatch?.length > 50 ? 'red' : 'black'}}>
                                    {titleWatch?.length}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{mb: 3, display: 'flex', flexDirection: 'column'}}>
                            <TextField
                                sx={{width: '100%'}}
                                label={'Resume'}
                                {...register('bio', {maxLength: 100})}
                                variant="outlined"
                                placeholder="max 100 tegn"
                            />
                            <Box
                                sx={{
                                    padding: '2px 8px',
                                    fontSize: '0.8rem',
                                    alignSelf: 'flex-end',
                                }}
                            >
                                <Typography variant="caption" component="span"
                                            sx={{color: bioWatch?.length > 100 ? 'red' : 'black'}}>
                                    {bioWatch?.length}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{mb: 3, display: 'flex', flexDirection: 'column'}}>
                            <TextField
                                sx={{width: '100%'}}
                                {...register('text', {maxLength: 2000})}
                                variant="outlined"
                                multiline
                                label={'Tekst'}
                                minRows={4}
                                placeholder="max 2.000 tegn"
                            />
                            <Box
                                sx={{
                                    padding: '2px 8px',
                                    fontSize: '0.8rem',
                                    alignSelf: 'flex-end',
                                }}
                            >
                                <Typography variant="caption" component="span"
                                            sx={{color: textWatch?.length > 2000 ? 'red' : 'black'}}>
                                    {textWatch?.length}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3}}>
                            {preview && (
                                <Box sx={{
                                    mb: 3,
                                    textAlign: 'center',
                                    backgroundColor: theme.palette.grey[300],
                                    width: '100%',
                                    borderRadius: '8px',
                                    position: 'relative'
                                }}>
                                    <Box
                                        component="img"
                                        src={preview}
                                        alt="Selected Preview"
                                        sx={{
                                            maxWidth: '100%',
                                            maxHeight: '200px',
                                            objectFit: 'contain',
                                            mt: 1
                                        }}
                                    />
                                    <IconButton
                                        onClick={handleRemoveImage}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            color: 'white',
                                            borderRadius: '50%',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                            }
                                        }}
                                    >
                                        <CloseIcon/>
                                    </IconButton>
                                </Box>
                            )}
                            <Button variant="contained" component="label">
                                {preview ? 'Skift billede' : 'Vælg billede'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleFileChange}
                                />
                            </Button>
                        </Box>
                        <Button variant="contained" color="primary" fullWidth type="submit" disabled={uploading}>
                            {uploading ? <CircularProgress color={'inherit'}/> : selectedPost ? 'Opdater' : 'Opret'}
                        </Button>
                    </form>
                </Box>
            </Box>
        </Drawer>
    );
};
