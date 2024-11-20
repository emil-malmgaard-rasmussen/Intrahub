import Grid from '@mui/material/Grid2';
import {
    Alert,
    Button,
    CircularProgress, FormControl, InputLabel,
    Select, SelectChangeEvent,
    Snackbar, SnackbarCloseReason,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Add from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {HealthSafetySection} from '../tabs/sections/HealthSafetySection';
import {EvaluationSection} from '../tabs/sections/EvaluationSection';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import {FormProvider, useFieldArray, useForm} from 'react-hook-form';
import {addDoc, collection, getDocs, query, serverTimestamp, Timestamp, where} from 'firebase/firestore';
import {db} from '../../../../Firebase';
import {ProjectsDrawer} from '../../../projects/components/ProjectsDrawer';
import {getAuth} from 'firebase/auth';
import LocalStorage from '../../../../utils/LocalStorage';
import Divider from '@mui/material/Divider';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import {Theme, useTheme} from '@mui/material/styles';
import data from '../../../landingpage/data';

interface ProjectApvTypeProps {
    displayDrawer: (value: boolean) => void;
    showNotification: (value: boolean) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
        fontWeight: personName.includes(name)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

export interface test {
    apvType: 'employeeApv';
    networkId: string;
    createdBy: string;
    createdAt: Timestamp;
    startDate: Timestamp;
    questions: any[];
    participants: {
        uid: string;
        displayName: string;
    }[]
}

const EmployeeApvType = (props: ProjectApvTypeProps) => {
    const {showNotification, displayDrawer} = props;
    const theme = useTheme();
    const [creating, setCreating] = useState<boolean>(false);
    const currentUser = getAuth().currentUser;
    const [open, setOpen] = useState(false);
    const networkId = LocalStorage.getNetworkId();
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [personName, setPersonName] = React.useState<string[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState<boolean>(true);

    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    // const handleChange = (event:any) => {
        const {
            target: { value },
        } = event;
        console.log(value);

        setPersonName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const methods = useForm<test>({
        defaultValues: {
            apvType: 'employeeApv',
            networkId: networkId!,
            createdBy: currentUser!.displayName!,
            startDate: serverTimestamp(),
            createdAt: serverTimestamp(),
            questions: [{title: '', description: '', type: 'YesNo'}],
            participants: [],
        }
    });

    const handleNotificationClose = (event?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setNotificationOpen(false);
    };

    const {register, handleSubmit, reset, control} = methods;

    const {fields, append, remove} = useFieldArray({
        control,
        name: "questions"
    });
    const {fields: participantsFields, append: appendParticipant, remove: removeParticipant} = useFieldArray({
        control,
        name: "participants",
    });

    const onSubmit = async (data: any) => {
        setCreating(true);
        try {
            await addDoc(collection(db, 'APV'), {
                ...data,
            });
            showNotification(true);
            reset();
        } catch (error) {
            console.error('Fejl ved oprettelse af APV:', error);
        } finally {
            setCreating(false);
            displayDrawer(false);
        }
    };

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const usersRef = collection(db, 'USERS');
            const q = query(usersRef, where('networks', 'array-contains', networkId));
            const querySnapshot = await getDocs(q);

            const fetchedUsers = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setUsers(fetchedUsers);
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [networkId])

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    sx={{width: '100%', display: 'none'}}
                    {...register('networkId')}
                    variant="outlined"
                />
                <Grid size={{xs: 12}}>
                    <Typography variant="h6" gutterBottom>
                        Spørgsmål
                    </Typography>
                    <Divider />
                    <FormControl
                        variant="outlined"
                        style={{ width: "100%", marginBottom: 32, margin: 1 }}
                    >
                        <InputLabel id="participants">Spørgsmål deltagere</InputLabel>
                        <Select
                            labelId="participants"
                            label={"Spørgsmål deltagere"}
                            style={{ width: "100%" }}
                            multiple
                            variant="outlined"
                            value={participantsFields.map((field) => field.uid)} // Use UIDs from useFieldArray fields
                            onChange={(event) => {
                                const {
                                    target: { value },
                                } = event;

                                const updatedUids = typeof value === "string" ? value.split(",") : value;

                                // Handle adding and removing participants without duplicates
                                updatedUids.forEach((uid) => {
                                    const isAlreadyAdded = participantsFields.some((field) => field.uid === uid);
                                    if (!isAlreadyAdded) {
                                        const user = users.find((user) => user.uid === uid);
                                        if (user) {
                                            appendParticipant({ uid: user.uid, displayName: user.displayName });
                                        }
                                    }
                                });

                                // Remove participants that are no longer selected
                                participantsFields.forEach((field, index) => {
                                    if (!updatedUids.includes(field.uid)) {
                                        removeParticipant(index);
                                    }
                                });
                            }}
                            input={<OutlinedInput id="select-multiple-chip" label="Spørgsmål deltagere" />}
                            renderValue={(selectedUids) => (
                                <Box sx={{ display: `--flexclip`, flexWrap: "wrap", gap: 0.5 }}>
                                    {selectedUids.map((uid) => {
                                        const participant = users.find((user) => user.uid === uid);
                                        return (
                                            <Chip
                                                key={uid}
                                                label={participant?.displayName}
                                                onMouseDown={(e) => e.stopPropagation()} // Prevent Select dropdown toggle
                                                onDelete={() => {
                                                    const indexToRemove = participantsFields.findIndex((field) => field.uid === uid);
                                                    removeParticipant(indexToRemove); // Remove participant from useFieldArray
                                                }}
                                            />
                                        );
                                    })}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {users.map((user) => (
                                <MenuItem
                                    key={user.uid}
                                    value={user.uid} // Bind value to UID
                                    style={getStyles(user.displayName, participantsFields.map((field) => field.uid), theme)}
                                >
                                    {user.displayName} {/* Display displayName */}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {fields.map((field, index) => (
                        <Grid container spacing={2} key={field.id} alignItems="flex-start" sx={{ marginBottom: 2, py: 2}}>
                            <Grid size={{xs: 5}}>
                                <TextField
                                    fullWidth
                                    {...register(`questions.${index}.title`, {required: true})}
                                    label="Titel"
                                    placeholder="Angiv titel"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid size={{xs: 6}}>
                                <TextField
                                    fullWidth
                                    {...register(`questions.${index}.description`, {required: true})}
                                    label="Beskrivelse"
                                    placeholder="Angiv beskrivelse"
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                            <Grid size={{xs: 1}}>
                                <IconButton color="error" onClick={() => remove(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}
                    <Button variant="outlined" sx={{my: 2}} onClick={() => append({ title: '', description: '', type: 'YesNo' })}>
                        Tilføj nyt spørgsmål
                    </Button>
                </Grid>
                <Grid size={{xs: 12}}>
                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={creating}>
                        {creating ? <CircularProgress color={'inherit'}/> : 'Opret APV'}
                    </Button>
                </Grid>
            </form>
        </FormProvider>
    )
}

export default EmployeeApvType;
