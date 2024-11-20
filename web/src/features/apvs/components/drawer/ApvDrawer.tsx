import Box from '@mui/material/Box';
import {Drawer, IconButton, Typography} from '@mui/material';
import {useForm} from 'react-hook-form';
import {ChangeEvent, useState} from 'react';
import {useTheme} from '@mui/material/styles';
import {getAuth} from 'firebase/auth';
import LocalStorage from '../../../../utils/LocalStorage';
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {db, storage} from '../../../../Firebase';
import {Iconify} from '../../../../components/Iconify';
import Divider from '@mui/material/Divider';
import {ApvTabs} from '../tabs/ApvTabs';

export interface ApvDrawerProps {
    open: boolean;
    displayDrawer: (value: boolean) => void;
    showNotification: (value: boolean) => void;
}

export const ApvDrawer = (props: ApvDrawerProps) => {
    const theme = useTheme();
    const {open, displayDrawer, showNotification} = props;
    const {register, handleSubmit, watch, reset} = useForm();
    const titleWatch = watch('title');
    const bioWatch = watch('bio');
    const textWatch = watch('text');
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const networkId = LocalStorage.getNetworkId();

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

    const onSubmit = async (data: any) => {
        const user = getAuth().currentUser;
        if (!user) return;

        const uid = user.uid;
        setUploading(true);
        let imageUrl = '';

        if (file) {
            const imageRef = ref(storage, `posts/${networkId}/${Date.now()}`);
            try {
                await uploadBytes(imageRef, file);
                imageUrl = await getDownloadURL(imageRef);
                console.log("UPLOADED", imageUrl);
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
            showNotification(true);
            reset();
        } catch (error) {
            console.error('Error adding document: ', error);
        } finally {
            setUploading(false);
            displayDrawer(false);
        }
    };

    return (
        <Drawer open={open} onClose={() => displayDrawer(false)} anchor={'right'}>
            <Box
                sx={{
                    width: 800,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Box display="flex" alignItems="center" sx={{pl: 2.5, pr: 1.5, pt: 2}}>
                    <Typography variant="h6" flexGrow={1}>
                        Opret APV
                    </Typography>
                    {/*<IconButton onClick={handleResetFilter}>*/}
                    {/*    <Badge color="error" variant="dot" invisible={!canReset()}>*/}
                    {/*        <Iconify icon="solar:refresh-linear"/>*/}
                    {/*    </Badge>*/}
                    {/*</IconButton>*/}
                    <IconButton onClick={() => displayDrawer(false)}>
                        <Iconify icon="mingcute:close-line"/>
                    </IconButton>
                </Box>
                <Box sx={{pl: 2.5, pr: 1.5,}}>
                    <Typography variant="body2" flexGrow={1}>
                        Her kan du oprette APV'er, vi her 2 løsninger: Manuelt eller AI.
                    </Typography>
                </Box>
                <Divider />
                <Box sx={{pl: 2.5, pr: 1.5, py: 2}}>
                    <ApvTabs displayDrawer={displayDrawer} showNotification={showNotification}/>
                </Box>
            </Box>
        </Drawer>
    );
};
