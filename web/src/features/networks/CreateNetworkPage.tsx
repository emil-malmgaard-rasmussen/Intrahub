import React from 'react';
import {useForm} from 'react-hook-form';
import {Box, Button, TextField, Typography} from '@mui/material';
import {useAuth} from '../auth/AuthProvider';
import {CreateNetworkModel, createNetworkRequest} from '../../firebase/NetworkQueries';
import Grid2 from '@mui/material/Grid2';
import {serverTimestamp} from 'firebase/firestore';

export const CreateNetworkPage = () => {
    const {user} = useAuth();
    const {handleSubmit, watch, reset, register} = useForm<CreateNetworkModel>({
        defaultValues: {
            address: '',
            administrators: [user?.uid],
            users: [user?.uid],
            city: '',
            contactEmail: '',
            contactPhone: '',
            description: '',
            logo: '',
            name: '',
            postalCode: '',
            createdAt: serverTimestamp(),
        },
    });
    const descriptionWatch = watch('description');


    const onSubmit = async (data: CreateNetworkModel) => {
        try {
            await createNetworkRequest(data);
            alert('Forspørgsel oprettet! Vi vender tilbage hurtigst muligt');
            reset();
        } catch (error) {
            console.error('Fejl:', error);
            alert('Vi kunne ikke oprette din forespørgsel - kontakt os på kontakt@hvsystemer.dk');
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            maxWidth={500}
            mx="auto"
            mt={5}
            gap={2}
        >
            <Typography variant="h4" textAlign="center">
                Ansøg om oprettelse af netværk
            </Typography>
            <Typography variant="body1" textAlign="center">
                Systemet er pt. i en lukket beta, det betyder at vi gennemgår "ansøgninger"
                om at blive en del af platformen, løbende.
            </Typography>
            <TextField
                fullWidth
                {...register('address', {required: true})}
                label="Adresse"
                required
            />
            <Grid2 container spacing={2}>
                <Grid2 size={{xs: 12, sm: 8}}>
                    <TextField
                        fullWidth
                        {...register('city', {required: true})}
                        label="By"
                        required
                    />
                </Grid2>
                <Grid2 size={{xs: 12, sm: 4}}>
                    <TextField
                        fullWidth
                        {...register('postalCode', {required: true})}
                        label="Postnummer"
                        required
                    />
                </Grid2>
            </Grid2>
            <TextField
                fullWidth
                {...register('contactEmail', {required: true})}
                label="Kontakt e-mail"
                type="email"
                required
            />
            <TextField
                fullWidth
                {...register('contactPhone', {required: true})}
                label="Kontakt tlf."
                required
            />
            <TextField
                fullWidth
                {...register('name', {required: true})}
                label="Gruppe navn"
                required
            />
            <TextField
                fullWidth
                {...register('description', {required: true, maxLength: 35})}
                label="Kort beskrivelse af virksomheden (max 30 karaktere)"
                required
                multiline
                minRows={3}
            />
            <Box
                sx={{
                    padding: '0px 8px',
                    fontSize: '0.8rem',
                    alignSelf: 'flex-end',
                }}
            >
                <Typography variant="caption" component="span"
                            sx={{color: descriptionWatch?.length > 35 ? 'red' : 'black'}}>
                    {descriptionWatch?.length}
                </Typography>
            </Box>
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Create Group
            </Button>
        </Box>
    );
};
