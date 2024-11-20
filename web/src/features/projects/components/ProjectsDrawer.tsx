import Box from '@mui/material/Box';
import {Button, CircularProgress, Drawer, IconButton, TextField, Typography} from '@mui/material';
import {useForm} from 'react-hook-form';
import {useState} from 'react';
import LocalStorage from '../../../utils/LocalStorage';
import {addDoc, collection} from 'firebase/firestore';
import {db} from '../../../Firebase';
import {Iconify} from '../../../components/Iconify';
import Divider from '@mui/material/Divider';

export interface ProjectsDrawerProps {
    open: boolean;
    displayDrawer: (value: boolean) => void;
    showNotification: (value: boolean) => void;
}

export const ProjectsDrawer = (props: ProjectsDrawerProps) => {
    const {open, displayDrawer, showNotification} = props;
    const {register, handleSubmit, reset} = useForm();
    const [uploading, setUploading] = useState<boolean>(false);
    const networkId = LocalStorage.getNetworkId();
    const handleResetFilter = () => {
        reset();
    }

    const onSubmit = async (data: any) => {
        setUploading(true);

        try {
            await addDoc(collection(db, 'PROJECTS'), {
                name: data.name,
                networkId,
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
                    width: 400,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Box display="flex" alignItems="center" sx={{pl: 2.5, pr: 1.5, py: 2}}>
                    <Typography variant="h6" flexGrow={1}>
                        Opret projekt
                    </Typography>

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
                                {...register('name')}
                                label={'Navn'}
                                variant="outlined"
                                placeholder=""
                            />
                        </Box>
                        <Button variant="contained" color="primary" fullWidth type="submit" disabled={uploading}>
                            {uploading ? <CircularProgress color={'inherit'}/> : 'Opret'}
                        </Button>
                    </form>
                </Box>
            </Box>
        </Drawer>
    );
};
