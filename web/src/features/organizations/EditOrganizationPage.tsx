import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {db, storage} from '../../Firebase';
import { Box, Paper, Stack, Typography, Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import LocalStorage from '../../utils/LocalStorage';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';

export default function EditOrganizationPage() {
    const networkId = LocalStorage.getNetworkId();
    const [network, setNetwork] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchNetworkDetails = async () => {
        try {
            setLoading(true);
            const networkDoc = doc(db, 'NETWORKS', networkId!);
            const docSnap = await getDoc(networkDoc);

            if (docSnap.exists()) {
                setNetwork({ id: docSnap.id, ...docSnap.data() });
            }
        } catch (error) {
            console.error('Error fetching network details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const imageRef = ref(storage, `logos/${networkId}/logo`);
            try {
                await uploadBytes(imageRef, file);
                const imageUrl = await getDownloadURL(imageRef);
                const networkDoc = doc(db, 'NETWORKS', networkId!);
                await updateDoc(networkDoc, { logo: imageUrl });

                setNetwork((prev: any) => ({ ...prev, logo: imageUrl }));
            } catch (error) {
                console.error('Error uploading image: ', error);
            }
        } catch (error) {
            console.error('Error uploading logo:', error);
        }
    };

    useEffect(() => {
        fetchNetworkDetails();
    }, [networkId]);

    if (loading) {
        return <CircularProgress />;
    }

    if (!network) {
        return <Typography variant="h6">Kunne ikke finde netværk med id: {networkId}.</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Paper variant="outlined" sx={{ p: 2, my: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h6">Generelt</Typography>
                </Stack>
                <Stack direction="column" spacing={1}>
                    <Typography variant="body1">Navn: {network.name}</Typography>
                    <Typography variant="body1">
                        Addresse: {network.address}, {network.postalCode} {network.city}
                    </Typography>
                    <Typography variant="body1">Logo</Typography>
                    <Stack direction="column" alignItems={'flex-start'} spacing={1}>
                        {/* Display logo or placeholder */}
                        <img
                            src={
                                network.logo
                                    ? network.logo
                                    : '/assets/images/post-placeholder.png'
                            }
                            alt="Network Logo"
                            style={{ width: 150, height: 150, borderRadius: 8, objectFit: 'cover', border: '1px solid #CECECE' }}
                        />
                            <Button
                                variant="contained"
                                component="label"
                                color="primary"
                            >
                                {network.logo ? 'Skift logo' : 'Tilføj logo'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleLogoUpload}
                                />
                            </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
}
