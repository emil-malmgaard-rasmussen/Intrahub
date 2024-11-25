import Box from '@mui/material/Box';
import {
    Button,
    CircularProgress,
    Drawer,
    IconButton, List,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {useFieldArray, useForm} from 'react-hook-form';
import {useState} from 'react';
import {getNetworkId} from  '../../../utils/LocalStorage';
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';
import {db, storage} from '../../../Firebase';
import {Iconify} from '../../../components/Iconify';
import Divider from '@mui/material/Divider';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {getAuth} from 'firebase/auth';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';

export interface ProjectsDrawerProps {
    open: boolean;
    displayDrawer: (value: boolean) => void;
    setNotificationState: (title: string, value: boolean) => void;
}

type FormValues = {
    name: string;
    files: { file: File; preview: string }[];
};

export const ProjectsDrawer = (props: ProjectsDrawerProps) => {
    const {open, displayDrawer, setNotificationState} = props;
    const { register, handleSubmit, control, reset } = useForm<FormValues>({
        defaultValues: {
            name: '',
            files: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'files',
    });

    const handleFileUpload = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files).map((file) => ({
            file,
            preview: file.type.startsWith('image/')
                ? URL.createObjectURL(file)
                : '/static/icons/pdf-icon.png', // Use a placeholder for PDFs
        }));
        append(newFiles);
    };

    const [uploading, setUploading] = useState<boolean>(false);
    const networkId = getNetworkId();
    const {currentUser} = getAuth();

    const onSubmit = async (data: FormValues) => {
        setUploading(true);

        try {
            const projectRef = await addDoc(collection(db, 'PROJECTS'), {
                name: data.name,
                networkId,
                createdAt: serverTimestamp(),
            });

            const projectId = projectRef.id;

            const uploadPromises = data.files
                .filter((item) => item.file)
                .map(async ({ file }) => {
                    if (!file) return;

                    const fileRef = ref(storage, `documents/${networkId}/${Date.now()}`);
                    await uploadBytes(fileRef, file);
                    const url = await getDownloadURL(fileRef);

                    await addDoc(collection(db, 'DOCUMENTS'), {
                        createdAt: serverTimestamp(),
                        networkId,
                        projectId,
                        title: file.name,
                        type: file.type || 'unknown',
                        url,
                        uploadedByName: currentUser?.displayName,
                        uploadedByUid: currentUser?.uid,
                    });
                });

            await Promise.all(uploadPromises);
            setNotificationState('Projektet er nu oprettet', true);
            reset();
        } catch (error) {
            console.error('Error adding project or documents:', error);
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
                <Box display="flex" alignItems="center" sx={{ pl: 2.5, pr: 1.5, py: 2 }}>
                    <Typography variant="h6" flexGrow={1}>
                        Opret projekt
                    </Typography>
                    <IconButton onClick={() => displayDrawer(false)}>
                        <Iconify icon="mingcute:close-line" />
                    </IconButton>
                </Box>
                <Divider />
                <Box sx={{ pt: 2 }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            fullWidth
                            {...register('name', { required: true })}
                            label="Projekt Navn"
                            variant="outlined"
                            sx={{ mb: 3 }}
                        />

                        {/* Modern Upload Section */}
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                component="label"
                                startIcon={<Iconify icon="material-symbols:upload-rounded" />}
                                sx={{ textTransform: 'none' }}
                            >
                                Upload filer
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    accept="application/pdf,image/png,image/jpeg"
                                    onChange={(e) => handleFileUpload(e.target.files)}
                                />
                            </Button>
                            <Typography variant="body2" color="text.secondary">
                                Acceptér PDF, PNG, JPG
                            </Typography>
                        </Stack>
                        {fields.length > 0 && (
                            <List dense>
                                {fields.map((field, index) => (
                                    <ListItem
                                        key={field.id}
                                        sx={{
                                            mb: 1,
                                            border: '1px solid #e0e0e0',
                                            borderRadius: 1,
                                            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: 'transparent',
                                                    mr: 2,
                                                    width: 48,
                                                    height: 48,
                                                }}
                                                variant="square"
                                                src={field.preview}
                                                alt={field.file?.name}
                                            >
                                                <Iconify icon="mdi:file-document-outline" sx={{color: '#CECECE'}} width={30} />
                                            </Avatar>
                                            <ListItemText
                                                primary={field.file?.name}
                                                secondary={`${(field.file?.size / 1024).toFixed(2)} KB`}
                                                sx={{ wordBreak: 'break-word' }}
                                            />
                                        </Box>
                                        <IconButton
                                            edge="end"
                                            onClick={() => remove(index)}
                                            color="error"
                                            sx={{ ml: 2 }}
                                        >
                                            <Iconify icon="mingcute:delete-line" />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={uploading}
                        >
                            {uploading ? <CircularProgress color="inherit" size={24} /> : 'Opret'}
                        </Button>
                    </form>
                </Box>
            </Box>
        </Drawer>
    );
};
