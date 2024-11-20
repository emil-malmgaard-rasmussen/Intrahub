import Grid from '@mui/material/Grid2';
import {
    Alert,
    Button,
    CircularProgress,
    Select,
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
import {addDoc, collection, getDocs, query, serverTimestamp, where} from 'firebase/firestore';
import {db} from '../../../../Firebase';
import {ProjectsDrawer} from '../../../projects/components/ProjectsDrawer';
import {getAuth} from 'firebase/auth';
import {getNetworkId} from '../../../../utils/LocalStorage';

interface ProjectApvTypeProps {
    displayDrawer: (value: boolean) => void;
    showNotification: (value: boolean) => void;
}

const ProjectApvType = (props: ProjectApvTypeProps) => {
    const {showNotification, displayDrawer} = props;
    const [creating, setCreating] = useState<boolean>(false);
    const currentUser = getAuth().currentUser;
    const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
    const [projects, setProjects] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const networkId = getNetworkId();
    const [notificationOpen, setNotificationOpen] = useState(false);

    const methods = useForm({
        defaultValues: {
            apvType: 'projectApv',
            networkId: networkId,
            createdBy: currentUser?.displayName,
            project: {},
            startDate: '',
            risks: [{name: '', description: '', assessment: '', preventiveMeasures: ''}],
            healthSafety: [{title: '', description: ''}],
            evaluation: [{title: '', description: ''}],
            conclusion: ''
        }
    });

    const handleNotificationClose = (event?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setNotificationOpen(false);
    };

    useEffect(() => {
        const fetchProjects = async () => {
            setLoadingProjects(true);
            try {
                const projectsRef = collection(db, 'PROJECTS');
                const q = query(projectsRef, where('networkId', '==', networkId));
                const querySnapshot = await getDocs(q);

                const fetchedProjects = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                }));

                setProjects(fetchedProjects);
            } finally {
                setLoadingProjects(false);
            }
        };

        fetchProjects();
    }, [networkId, notificationOpen]);

    const {register, handleSubmit, reset, control} = methods;

    const {fields, append, remove} = useFieldArray({
        control,
        name: "risks"
    });

    const onSubmit = async (data: any) => {
        setCreating(true);
        try {
            await addDoc(collection(db, 'APV'), {
                ...data,
                startDate: new Date(data.startDate),
                createdAt: serverTimestamp()
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

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    sx={{width: '100%', display: 'none'}}
                    {...register('networkId')}
                    variant="outlined"
                />
                <Grid container size={{xs: 12}} spacing={2}>
                    <Grid size={{xs: 6}}>
                        <TextField
                            sx={{width: '100%'}}
                            label="Startdato"
                            type="date"
                            {...register('startDate', {required: true})}
                            variant="outlined"
                            slotProps={{
                                inputLabel: {
                                    shrink: true
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{xs: 6}}>
                        <Grid container size={{xs: 12}} spacing={2}>
                            <Grid size={{xs: 10}}>
                                <Select
                                    sx={{width: '90%'}}
                                    {...register('project', {required: true})}
                                    defaultValue=""
                                    variant="outlined"
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        Vælg projekt
                                    </MenuItem>
                                    {loadingProjects ? (
                                        <MenuItem sx={{justifyContent: "center", display: 'flex'}}>
                                            <CircularProgress/>
                                        </MenuItem>
                                    ) : projects?.map((project: any) => (
                                        <MenuItem value={project}>{project.name}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid size={{xs: 2}} sx={{justifyContent: 'flex-end', display: 'flex'}}>
                                <Button variant="contained" color="primary" sx={{height: '100%'}}
                                        onClick={() => setOpen(true)}>
                                    <Add/>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid size={{xs: 12}}>
                    <Typography variant="h6" gutterBottom>
                        Risici
                    </Typography>
                    <Box sx={{width: '100%', overflowX: 'auto', marginBottom: '16px'}}>
                        <Table sx={{minWidth: 1000}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Risiko</TableCell>
                                    <TableCell>Vurdering (Lav, Mellem, Høj)</TableCell>
                                    <TableCell>Beskrivelse</TableCell>
                                    <TableCell>Forebyggende foranstaltninger</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fields.map((field, index) => (
                                    <TableRow key={field.id}>
                                        <TableCell sx={{verticalAlign: 'top'}}>
                                            <TextField
                                                sx={{width: '100%'}}
                                                {...register(`risks.${index}.name`, {
                                                    maxLength: 100,
                                                    required: true
                                                })}
                                                variant="outlined"
                                                placeholder="Risiko navn"
                                            />
                                        </TableCell>
                                        <TableCell sx={{verticalAlign: 'top'}}>
                                            <Select
                                                sx={{width: '100%'}}
                                                {...register(`risks.${index}.assessment`, {required: true})}
                                                defaultValue=""
                                                variant="outlined"
                                                displayEmpty
                                            >
                                                <MenuItem value="" disabled>
                                                    Vælg vurdering
                                                </MenuItem>
                                                <MenuItem value="Lav">Lav</MenuItem>
                                                <MenuItem value="Mellem">Mellem</MenuItem>
                                                <MenuItem value="Høj">Høj</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell sx={{verticalAlign: 'top'}}>
                                            <TextField
                                                sx={{width: '100%', minWidth: '200px'}}
                                                {...register(`risks.${index}.description`, {required: true})}
                                                variant="outlined"
                                                placeholder="Beskrivelse"
                                                multiline
                                                rows={4}
                                            />
                                        </TableCell>
                                        <TableCell sx={{verticalAlign: 'top'}}>
                                            <TextField
                                                sx={{width: '100%', minWidth: '200px'}}
                                                {...register(`risks.${index}.preventiveMeasures`, {required: true})}
                                                variant="outlined"
                                                placeholder="Forebyggende foranstaltninger"
                                                multiline
                                                rows={4}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton color="error" onClick={() => remove(index)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Button variant="contained" color="primary"
                                onClick={() => append({
                                    name: '',
                                    description: '',
                                    assessment: '',
                                    preventiveMeasures: ''
                                })}>
                            Tilføj Risiko
                        </Button>
                    </Box>
                </Grid>
                <HealthSafetySection/>
                <EvaluationSection/>
                <Grid size={{xs: 12}}>
                    <TextField
                        sx={{width: '100%'}}
                        label="Konklusion"
                        {...register('conclusion', {required: true})}
                        variant="outlined"
                        placeholder="Samlet vurdering - max 500 tegn"
                        multiline
                        rows={4}
                    />
                </Grid>
                <Grid size={{xs: 12}}>
                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={creating}>
                        {creating ? <CircularProgress color={'inherit'}/> : 'Opret APV'}
                    </Button>
                </Grid>
                <ProjectsDrawer open={open} displayDrawer={setOpen} showNotification={setNotificationOpen}/>
                <Snackbar
                    open={notificationOpen}
                    autoHideDuration={4000}
                    onClose={handleNotificationClose}
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                    <Alert onClose={handleNotificationClose} severity="success" variant="filled">
                        Projektet er nu oprettet
                    </Alert>
                </Snackbar>
            </form>
        </FormProvider>
    )
}

export default ProjectApvType;
