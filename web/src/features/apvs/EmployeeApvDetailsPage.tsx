import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Box, Breadcrumbs, CircularProgress, Link, Paper, Stack, Table, TableBody, TableContainer, Typography} from '@mui/material';
import {useTable} from '../users/UsersPage';
import {EmployeeApvModel} from '../../firebase/models/EmployeeApvModel';
import {fetchEmployeeApv} from '../../firebase/ApvQueries';
import {Scrollbar} from '../../components/Scrollbar';
import {TableEmptyRows, UserTableRow} from '../users/components/table/UsersTable';
import { emptyRows } from '../users/components/table/utils';
import {ParticipantsTableHead, ParticipantTableRow} from './components/table/ParticipantsTable';

export const EmployeeApvDetailsPage = () => {
    const {id = ''} = useParams();
    const [apv, setApv] = useState<EmployeeApvModel | null>(null);
    const [loading, setLoading] = useState(true);
    const table = useTable();
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployeeApv(id).then((d: EmployeeApvModel | null) => {
            setApv(d);
            setLoading(false);
        })
    }, [id]);

    if (loading) {
        return <CircularProgress/>;
    }

    if (!apv) {
        return <Typography variant="h6">Kunne ikke finde APV med id: {id}.</Typography>;
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
                    <Typography color="text.primary">Detaljer</Typography>
                </Breadcrumbs>
            </Stack>
            <Paper variant="outlined" sx={{p: 2, my: 3}}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h6">Type:</Typography>
                    <Typography variant="body1">Medarbejder APV</Typography>
                </Stack>
            </Paper>
            <Paper variant="outlined" sx={{p: 2, mb: 3}}>
                <Typography variant="h6">Deltagere</Typography>
                <Scrollbar>
                    <TableContainer sx={{overflow: 'unset', marginY: 2}}>
                        <Table sx={{minWidth: 800}}>
                            <ParticipantsTableHead
                                order={table.order}
                                orderBy={table.orderBy}
                                rowCount={apv.participants.length}
                                numSelected={table.selected.length}
                                onSort={table.onSort}
                                onSelectAllRows={(checked) =>
                                    table.onSelectAllRows(
                                        checked,
                                        apv?.participants.map((risk) => risk.uid)
                                    )
                                }
                                headLabel={[
                                    {id: 'name', label: 'Navn'},
                                    {id: ' ', label: ''},
                                ]}
                            />
                            <TableBody>
                                {apv.participants.map((row, index) => (
                                    <ParticipantTableRow
                                        key={index}
                                        row={row}
                                        selected={table.selected.includes(row.uid)}
                                        onSelectRow={() => table.onSelectRow(row.uid)}
                                    />
                                ))}

                                <TableEmptyRows
                                    height={68}
                                    emptyRows={emptyRows(table.page, table.rowsPerPage, apv.participants.length)}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </Paper>

            <Paper variant="outlined" sx={{p: 2, mb: 3}}>
                <Typography variant="h6">Sundhed og sikkerhed</Typography>
                <Stack component="ul">
                    {/*{apv.healthSafety?.map((item: HealthSafetyModel, index: number) => (*/}
                    {/*    <Box key={index} component="li" sx={{p: 1}}>*/}
                    {/*        <Typography variant="subtitle1">{item.title}</Typography>*/}
                    {/*        <Typography variant="body2">{item.description}</Typography>*/}
                    {/*    </Box>*/}
                    {/*))}*/}
                </Stack>
            </Paper>

            <Paper variant="outlined" sx={{p: 2, mb: 3}}>
                <Typography variant="h6">Evaluering og opfølgning</Typography>
                <Stack component="ul">
                    {/*{apv.evaluation?.map((item: EvaluationModel, index: number) => (*/}
                    {/*    <Box key={index} component="li" sx={{p: 1}}>*/}
                    {/*        <Typography variant="subtitle1">{item.title}</Typography>*/}
                    {/*        <Typography variant="body2">{item.description}</Typography>*/}
                    {/*    </Box>*/}
                    {/*))}*/}
                </Stack>
            </Paper>

            <Paper variant="outlined" sx={{p: 2, mb: 3}}>
                <Typography variant="h6">Konklusion</Typography>
                {/*<Typography variant="body1">{apv.conclusion}</Typography>*/}
            </Paper>
        </Box>
    );
}
