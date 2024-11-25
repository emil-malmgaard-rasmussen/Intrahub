import Box from '@mui/material/Box';
import {Button, CircularProgress, Drawer, IconButton, TextField, Typography} from '@mui/material';
import {useForm} from 'react-hook-form';
import {useEffect, useState} from 'react';
import {getNetworkId} from '../../../utils/LocalStorage';
import {addDoc, collection, Timestamp} from 'firebase/firestore';
import {db} from '../../../Firebase';
import {Iconify} from '../../../components/Iconify';
import Divider from '@mui/material/Divider';
import {getAuth} from 'firebase/auth';
import {ActivityModel} from '../../../firebase/models/ActivityModel';
import {editActivity} from '../../../firebase/ActivityQueries';

export interface ProjectsDrawerProps {
    open: boolean;
    displayDrawer: (value: boolean) => void;
    setNotificationsState: (title: string, value: boolean) => void;
    selectedActivity?: ActivityModel;
}

export const ActivitiesDrawer = (props: ProjectsDrawerProps) => {
    const {open, displayDrawer, setNotificationsState, selectedActivity} = props;
    const {register, handleSubmit, reset} = useForm();
    const [uploading, setUploading] = useState<boolean>(false);
    const networkId = getNetworkId();
    const {currentUser} = getAuth();

    useEffect(() => {
        if (selectedActivity) {
            reset({
                title: selectedActivity.title,
                description: selectedActivity.description,
                dateFrom: selectedActivity.dateFrom.toDate().toISOString().split('T')[0],
                dateTo: selectedActivity.dateTo ? selectedActivity?.dateTo.toDate().toISOString().split('T')[0] : undefined,
            });
        } else {
            reset({
                title: '',
                description: '',
                dateFrom: '',
                dateTo: '',
            });
        }
    }, [selectedActivity, reset]);

    const onSubmit = async (data: any) => {
        setUploading(true);

        const activityData = {
            ...data,
            dateFrom: Timestamp.fromDate(new Date(data.dateFrom)),
            dateTo: data.dateTo ? Timestamp.fromDate(new Date(data.dateTo)) : null,
        };

        try {
            if (selectedActivity) {
                await editActivity(selectedActivity.id, activityData);
                setNotificationsState('Aktiviteten er nu opdateret', true);
            } else {
                const newActivityData = {
                    ...activityData,
                    createdAt: Timestamp.now(),
                    createdBy: currentUser?.displayName,
                    createdByUid: currentUser?.uid,
                    networkId,
                };
                await addDoc(collection(db, 'ACTIVITIES'), newActivityData);
                setNotificationsState('Aktiviteten er nu oprettet', true);
                reset();
            }
        } catch (error) {
            console.error('Error processing activity: ', error);
        } finally {
            setUploading(false);
            displayDrawer(false);
        }
    };

    return (
        <Drawer open={open} onClose={() => displayDrawer(false)} anchor="right">
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
                        Opret Aktivitet
                    </Typography>
                    <IconButton onClick={() => displayDrawer(false)}>
                        <Iconify icon="mingcute:close-line"/>
                    </IconButton>
                </Box>
                <Divider/>
                <Box sx={{pl: 2.5, pr: 1.5, py: 2}}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{mb: 3}}>
                            <TextField
                                fullWidth
                                {...register('title', {required: 'Titel er påkrævet'})}
                                label="Titel"
                                // defaultValue={selectedActivity?.title || ''}
                                variant="outlined"
                            />
                        </Box>
                        <Box sx={{mb: 3}}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                {...register('description')}
                                label="Beskrivelse"
                                // defaultValue={selectedActivity?.description || ''}
                                variant="outlined"
                            />
                        </Box>
                        <Box sx={{mb: 3}}>
                            <TextField
                                fullWidth
                                {...register('dateFrom', {required: 'Startdato er påkrævet'})}
                                label="Startdato"
                                // defaultValue={selectedActivity?.dateFrom || new Date()}
                                type="date"
                                slotProps={{
                                    inputLabel: {
                                        shrink: true
                                    },
                                }}
                            />
                        </Box>
                        <Box sx={{mb: 3}}>
                            <TextField
                                fullWidth
                                {...register('dateTo', {required: false})}
                                label="Slutdato"
                                // defaultValue={selectedActivity?.dateTo || new Date()}
                                type="date"
                                slotProps={{
                                    inputLabel: {
                                        shrink: true
                                    },
                                }}
                            />
                        </Box>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            type="submit"
                            disabled={uploading}
                        >
                            {uploading ?
                                <CircularProgress color="inherit" size={24}/> : selectedActivity ? 'Opdater' : 'Opret'}
                        </Button>
                    </form>
                </Box>
            </Box>
        </Drawer>
    );
};
