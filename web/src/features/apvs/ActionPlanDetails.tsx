import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Box, Breadcrumbs, CircularProgress, Grid2, Link, Paper, Stack, Typography,} from '@mui/material';
import {Scrollbar} from '../../components/Scrollbar';
import {fetchApvEmployeeAnswers, fetchActionPlan} from '../../firebase/ApvQueries';
import {ApvActionPlan} from '../../firebase/models/ApvActionPlan';
import {Answer, ApvAnswer} from '../../firebase/models/ApvAnswerModel';

export const ActionPlanDetails = () => {
    const {id = ''} = useParams();
    const [actionPlan, setActionPlan] = useState<ApvActionPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [apv, setApv] = useState<ApvAnswer[] | null>(null);

    const translateStatus = (status: 'notStarted' | 'inProgress' | 'completed' | 'onHold') => {
        switch (status) {
            case 'notStarted':
                return 'Ikke startet';
            case 'inProgress':
                return 'Igang';
            case 'completed':
                return 'Færdig';
            case 'onHold':
                return 'På hold';
            default:
                return 'Ukendt';
        }
    }

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
    // Fetch the action plan when the component loads
    useEffect(() => {
        const fetchData = async () => {
            const fetchedActionPlan = await fetchActionPlan(id);
            setActionPlan(fetchedActionPlan);
            setLoading(false);
        };

        fetchApvEmployeeAnswers(id).then((d: ApvAnswer[] | null) => {
            setApv(d);
            setLoading(false);
        });

        fetchData();
    }, [id]);

    if (loading) {
        return <CircularProgress/>;
    }

    if (!actionPlan) {
        return <Typography variant="h6">Kunne ikke finde handlingsplan med id: {id}.</Typography>;
    }

    return (
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
                    <Typography color="text.primary">Se handlingsplan</Typography>
                </Breadcrumbs>
            </Stack>

            <Paper variant="outlined" sx={{p: 2, my: 3}}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1">
                        Handlingsplan oprettet d. {actionPlan.createdAt.toDate().toLocaleDateString()}
                    </Typography>
                </Stack>
            </Paper>

            <Grid2 container spacing={2}>
                <Grid2 size={{xs: 12, md: 6}}>
                    <Box sx={{p: 3}}>
                        <Stack spacing={2}>
                            {actionPlan.actions.map((action: any, index: number) => (
                                <Paper key={index} variant="outlined" sx={{p: 2, mb: 2}}>
                                    <Stack spacing={2}>
                                        <Typography variant="h6">Problemstilling</Typography>
                                        <Typography variant="body1">{action.issue}</Typography>

                                        <Typography variant="h6">Handling</Typography>
                                        <Typography variant="body1">{action.action}</Typography>

                                        <Typography variant="h6">Ansvarlig</Typography>
                                        <Typography variant="body1">
                                            {action.responsible.displayName}
                                        </Typography>

                                        <Typography variant="h6">Deadline</Typography>
                                        <Typography
                                            variant="body1">{action.deadline.toDate().toLocaleDateString()}</Typography>

                                        <Typography variant="h6">Status</Typography>
                                        <Typography variant="body1">{translateStatus(action.status)}</Typography>
                                    </Stack>
                                </Paper>
                            ))}
                        </Stack>
                    </Box>
                </Grid2>

                <Grid2 size={{xs: 12, md: 6}}>
                    <Box sx={{p: 3}}>
                        <Paper variant="outlined" sx={{p: 2, mb: 3}}>
                            <Typography variant="h6">Spørgsmål</Typography>
                            <Scrollbar sx={{maxHeight: 400, overflowY: 'auto'}}>
                                <Stack component="ul">
                                    {apv![0].answers?.map((answer, index) => (
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
    );
};
