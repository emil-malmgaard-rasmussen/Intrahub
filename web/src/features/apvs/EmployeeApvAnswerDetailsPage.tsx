import {useNavigate, useParams} from 'react-router-dom';
import {Box, Breadcrumbs, Link, Paper, Stack, Table, TableBody, Typography} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {fetchApvAnswers} from '../../firebase/ApvQueries';
import { Scrollbar } from '../../components/Scrollbar';
import TableContainer from '@mui/material/TableContainer';
import {ParticipantAnswerTableHead, ParticipantAnswerTableRow} from './components/table/ParticipantAnswerTable';
import {useTable} from '../users/UsersPage';
import {Answer} from '../../firebase/models/ApvAnswerModel';

export const EmployeeApvAnswerDetailsPage = () => {
    const {id = '', uid = ''} = useParams();
    const navigate = useNavigate();
    const [answer, setAnswer] = useState<any>();
    const table = useTable();
    console.log(answer)

    useEffect(() => {
        fetchApvAnswers(id, uid).then(d => setAnswer(d))
    }, []);

    if (!answer) {
        return <Typography variant="h6">Kunne ikke finde nogen svar</Typography>;
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
                        APV'er
                    </Link>
                    <Link
                        underline="hover"
                        color="primary"
                        onClick={() => navigate(`/apvs/${id}`)}
                        sx={{cursor: 'pointer'}}
                    >
                        Detaljer
                    </Link>
                    <Typography color="text.primary">Svar</Typography>
                </Breadcrumbs>
            </Stack>
            <Paper variant="outlined" sx={{p: 2, my: 3}}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h6">Type:</Typography>
                    <Typography variant="body1">Medarbejder APV</Typography>
                </Stack>
            </Paper>

            <Paper variant="outlined" sx={{p: 2, mb: 3}}>
                <Typography variant="h6">Svar</Typography>
                <Scrollbar>
                    <TableContainer sx={{overflow: 'unset', marginY: 2}}>
                        <Table sx={{minWidth: 800}}>
                            <ParticipantAnswerTableHead
                                onSort={table.onSort}
                                headLabel={[
                                    { id: 'title', label: 'Titel', align: 'left' },
                                    { id: 'description', label: 'Spørgsmål', align: 'left' },
                                    { id: 'answerValue', label: 'Svar', align: 'left' },
                                    { id: 'comment', label: 'Evt. kommentar', align: 'left' },
                                ]}
                            />
                            <TableBody>
                                {answer.answers.map((row: Answer, index: number) => (
                                    <ParticipantAnswerTableRow
                                        key={index}
                                        row={row}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </Paper>
        </Box>
    )
}
