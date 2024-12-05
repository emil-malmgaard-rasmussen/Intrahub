import React, {SyntheticEvent, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Alert,
    Box,
    Breadcrumbs,
    CircularProgress,
    FormControl,
    InputLabel,
    Link,
    Paper,
    Select,
    Snackbar,
    SnackbarCloseReason,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {fetchApvEmployeeAnswers, saveActionPlan} from '../../firebase/ApvQueries';
import {Scrollbar} from '../../components/Scrollbar';
import {Answer, ApvAnswer} from '../../firebase/models/ApvAnswerModel';
import Grid2 from '@mui/material/Grid2';
import {useFieldArray, useForm} from 'react-hook-form';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import {fetchGroupUsers} from '../../firebase/MemberQueries';
import {UserModel} from '../../firebase/models/UserModel';
import {Timestamp} from 'firebase/firestore';

export const CreateActionPlanDetails = () => {
    const {id = ''} = useParams();
    const [apv, setApv] = useState<ApvAnswer[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingGroupUsers, setLoadingGroupUsers] = useState(true);
    const [groupUsers, setGroupUsers] = useState<UserModel[] | null>(null);
    const navigate = useNavigate();
    const networkId = localStorage.getItem('networkId');
    const [notificationState, setNotificationState] = useState<{
        title: string,
        show: boolean,
        severity: 'success' | 'error' | 'warning' | undefined
    }>({title: '', show: false, severity: undefined});

    const {control, handleSubmit, register, formState: {errors}} = useForm({
        defaultValues: {
            actions: [
                {
                    issue: '',
                    action: '',
                    responsible: '',
                    deadline: '',
                    status: '',
                },
            ],
        },
    });

    const {fields, append, remove} = useFieldArray({
        control,
        name: 'actions',
    });

    const handleNotificationClose = (event?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setNotificationState({title: '', show: false, severity: undefined});
    };

    const onSubmit = async (data: any) => {
        try {
            const transformedActions = data.actions.map((action: any) => ({
                ...action,
                responsible: JSON.parse(action.responsible),
                deadline: Timestamp.fromDate(new Date(action.deadline)),
            }));

            await saveActionPlan(id, transformedActions);
            setNotificationState({severity: 'success', show: true, title: 'Handlingsplan oprettet'})
        } catch (error) {
            setNotificationState({severity: 'error', show: true, title: 'Handlingsplan ikke oprettet, kontakt admin'})
        }
    };

    useEffect(() => {
        fetchApvEmployeeAnswers(id).then((d: ApvAnswer[] | null) => {
            setApv(d);
            setLoading(false);
        });

        if (networkId) {
            fetchGroupUsers(networkId).then((d: UserModel[] | null) => {
                setGroupUsers(d);
                setLoadingGroupUsers(false);
            });
        }

    }, [id]);

    const getBundledQuestions = () => {
        if (!apv || apv.length === 0) return [];

        const allAnswers = apv.flatMap(item => item.answers);

        const answeredQuestions = allAnswers.filter((a: Answer) => a.answer);

        const groupedQuestions: { [key: string]: { title: string, description: string, comments: string[] } } = {};

        answeredQuestions.forEach((a: Answer) => {
            const key = `${a.title}:${a.description}`;
            if (!groupedQuestions[key]) {
                groupedQuestions[key] = {title: a.title, description: a.description, comments: []};
            }
            groupedQuestions[key].comments.push(a.comment);
        });

        return Object.values(groupedQuestions);
    };


    const bundledQuestions = getBundledQuestions();

    if (loading) {
        return <CircularProgress/>;
    }

    if (!apv) {
        return <Typography variant="h6">Kunne ikke finde APV med id: {id}.</Typography>;
    }

    return (
        <>
            <Box sx={{p: 3}}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="hover"
                            color="primary"
                            onClick={() => navigate('/apvs')}
                            sx={{cursor: 'pointer'}}
                        >
                            Liste
                        </Link>
                        <Typography color="text.primary">Opret handlingsplan</Typography>
                    </Breadcrumbs>
                </Stack>
                <Paper variant="outlined" sx={{p: 2, my: 3}}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1">Udarbejd en handlingsplan for medarbejder APV, til højre ser du
                            spørgsmål og herunder besvarelser for medarbejderne i perioden</Typography>
                    </Stack>
                </Paper>
                <Grid2 container spacing={2}>
                    <Grid2 size={{xs: 12, md: 6}}>
                        <Box sx={{p: 3}}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Stack spacing={2}>
                                    {fields.map((field, index) => (
                                        <Paper
                                            key={field.id}
                                            variant="outlined"
                                            sx={{p: 2, mb: 2}}
                                        >
                                            <Stack spacing={2}>
                                                <TextField
                                                    label="Problemstilling"
                                                    error={errors.actions && !!errors.actions[index]?.issue}
                                                    {...register(`actions.${index}.issue`, {required: true})}
                                                    fullWidth
                                                    variant="outlined"
                                                />
                                                <TextField
                                                    label="Handling"
                                                    error={errors.actions && !!errors.actions[index]?.action}
                                                    {...register(`actions.${index}.action`, {required: true})}
                                                    fullWidth
                                                    variant="outlined"
                                                />
                                                <FormControl fullWidth>
                                                    <InputLabel>Ansvarlig</InputLabel>
                                                    <Select
                                                        error={errors.actions && !!errors.actions[index]?.responsible}
                                                        {...register(`actions.${index}.responsible`, {required: true})}
                                                        label="Ansvarlig"
                                                        disabled={loadingGroupUsers}
                                                    >
                                                        {loadingGroupUsers ? (
                                                            <MenuItem disabled>
                                                                <Stack direction="row" alignItems="center">
                                                                    <CircularProgress size={20} sx={{mr: 1}}/>
                                                                    Indlæser...
                                                                </Stack>
                                                            </MenuItem>
                                                        ) : (
                                                            groupUsers?.map((user) => (
                                                                <MenuItem
                                                                    key={user.id}
                                                                    value={JSON.stringify({
                                                                        displayName: user.displayName,
                                                                        uid: user.id
                                                                    })}
                                                                >
                                                                    {user.displayName}
                                                                </MenuItem>
                                                            ))
                                                        )}
                                                    </Select>
                                                </FormControl>
                                                <TextField
                                                    error={errors.actions && !!errors.actions[index]?.deadline}
                                                    label="Deadline"
                                                    {...register(`actions.${index}.deadline`, {required: true})}
                                                    fullWidth
                                                    type="date"
                                                    slotProps={{
                                                        inputLabel: {
                                                            shrink: true
                                                        }
                                                    }}
                                                    variant="outlined"
                                                />
                                                <FormControl fullWidth>
                                                    <InputLabel>Status</InputLabel>
                                                    <Select
                                                        error={errors.actions && !!errors.actions[index]?.status}
                                                        {...register(`actions.${index}.status`, {required: true})}
                                                        label="Status"
                                                    >
                                                        <MenuItem value="notStarted">Ikke startet</MenuItem>
                                                        <MenuItem value="inProgress">Igang</MenuItem>
                                                        <MenuItem value="completed">Færdig</MenuItem>
                                                        <MenuItem value="onHold">På hold</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => remove(index)}
                                                    startIcon={<DeleteIcon/>}
                                                >
                                                    Fjern
                                                </Button>
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Stack>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() =>
                                        append({
                                            issue: '',
                                            action: '',
                                            responsible: '',
                                            deadline: '',
                                            status: '',
                                        })
                                    }
                                    sx={{mt: 2}}
                                >
                                    Tilføj ny handling
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{mt: 2, ml: 2}}
                                >
                                    Godkend handlingsplan
                                </Button>
                            </form>
                        </Box>
                    </Grid2>
                    <Grid2 size={{xs: 12, md: 6}}>
                        <Box sx={{p: 3}}>
                            <Paper variant="outlined" sx={{p: 2, mb: 3}}>
                                <Typography variant="h6">Spørgsmål</Typography>
                                <Scrollbar sx={{maxHeight: 400, overflowY: 'auto'}}>
                                    <Stack component="ul">
                                        {apv[0].answers?.map((answer, index) => (
                                            <Box key={index} component="li" sx={{p: 1}}>
                                                <Typography variant="subtitle1">{answer.title}</Typography>
                                                <Typography variant="body2">{answer.description}</Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Scrollbar>
                            </Paper>
                            <Paper variant="outlined" sx={{p: 2, mb: 3}}>
                                <Typography variant="h6">Spørgsmål med svar "ja"</Typography>
                                <Scrollbar>
                                    <Stack spacing={2}>
                                        {bundledQuestions.length > 0 ? (
                                            bundledQuestions.map((bundle, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        p: 2,
                                                        border: '1px solid',
                                                        borderColor: 'grey.300',
                                                        borderRadius: 1,
                                                    }}
                                                >
                                                    <Typography variant="subtitle1">{bundle.title}</Typography>
                                                    <Typography variant="body2" sx={{mb: 1}}>
                                                        {bundle.description}
                                                    </Typography>
                                                    {bundle.comments.length > 0 && (
                                                        <Typography variant="body2" sx={{fontWeight: 'bold', mb: 1}}>
                                                            Kommentarer:
                                                        </Typography>
                                                    )}
                                                    <Stack component="ul" spacing={1}>
                                                        {bundle.comments.map((comment, commentIndex) => (
                                                            <Box key={commentIndex} component="li" sx={{pl: 2}}>
                                                                <Typography variant="body2">{comment}</Typography>
                                                            </Box>
                                                        ))}
                                                    </Stack>
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography variant="body2">Ingen spørgsmål med svar "ja".</Typography>
                                        )}
                                    </Stack>
                                </Scrollbar>
                            </Paper>
                        </Box>
                    </Grid2>
                </Grid2>
            </Box>
            <Snackbar
                open={notificationState.show}
                autoHideDuration={4000}
                onClose={handleNotificationClose}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={handleNotificationClose} severity={notificationState.severity} variant="filled">
                    {notificationState.title}
                </Alert>
            </Snackbar>
        </>
    );
};
