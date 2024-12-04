import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {doc, getDoc} from 'firebase/firestore';
import {Box, Breadcrumbs, CircularProgress, Link, Paper, Stack, Typography} from '@mui/material';
import {db} from '../../Firebase';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import {TableEmptyRows} from '../users/components/table/UsersTable';
import TableBody from '@mui/material/TableBody';
import {emptyRows} from '../users/components/table/utils';
import {Scrollbar} from '../../components/Scrollbar';
import {useTable} from '../users/UsersPage';
import {ApvRisksTableHead, ApvRiskTableRow} from './components/ApvRisksTable';
import {EvaluationModel, HealthSafetyModel, ProjectApvModel} from '../../firebase/models/ProjectApvModel';

export const ProjectApvDetailsPage = () => {
    const {id = ''} = useParams();
    const [apv, setApv] = useState<ProjectApvModel | null>(null);
    const [loading, setLoading] = useState(true);
    const table = useTable();
    const navigate = useNavigate();

    const fetchApvDetails = async () => {
        try {
            setLoading(true);
            const apvDoc = doc(db, 'APV', id!);
            const docSnap = await getDoc(apvDoc);

            if (docSnap.exists()) {
                setApv({id: docSnap.id, ...docSnap.data()} as ProjectApvModel);
            }
        } catch (error) {
            console.error('Error fetching APV details:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchApvDetails();
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
                        Liste
                    </Link>
                    <Typography color="text.primary">Detaljer</Typography>
                </Breadcrumbs>
            </Stack>
            <Paper variant="outlined" sx={{p: 2, my: 3}}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h6">Projekt:</Typography>
                    <Typography variant="body1">{apv.project.name}</Typography>
                </Stack>
            </Paper>
            <Paper variant="outlined" sx={{p: 2, mb: 3}}>
                <Typography variant="h6">Risici</Typography>
                {/*<Stack spacing={2}>*/}
                {/*    {apv.risks?.map((risk: ApvRiskModel, index: number) => (*/}
                {/*        <Box key={index} sx={{p: 1, border: '1px solid', borderRadius: 1}}>*/}
                {/*            <Typography variant="subtitle1">Name: {risk.name}</Typography>*/}
                {/*            <Typography variant="body2">Description: {risk.description}</Typography>*/}
                {/*            <Typography variant="body2">Assessment: {risk.assessment}</Typography>*/}
                {/*            <Typography variant="body2">Preventive Measures: {risk.preventiveMeasures}</Typography>*/}
                {/*        </Box>*/}
                {/*    ))}*/}
                {/*</Stack>*/}
                <Scrollbar>
                    <TableContainer sx={{overflow: 'unset', marginY: 2}}>
                        <Table sx={{minWidth: 800}}>
                            <ApvRisksTableHead
                                order={table.order}
                                orderBy={table.orderBy}
                                rowCount={apv.risks.length}
                                numSelected={table.selected.length}
                                onSort={table.onSort}
                                onSelectAllRows={(checked) =>
                                    table.onSelectAllRows(
                                        checked,
                                        apv.risks.map((risk, index) => `${risk.name}_${index}`)
                                    )
                                }
                                headLabel={[
                                    {id: 'name', label: 'Navn'},
                                    {id: 'assessment', label: 'Risikovurdering (Lav, Mellem, Høj)'},
                                    {id: 'description', label: 'Beskrivelse'},
                                    {id: 'preventiveMeasures', label: 'Forebyggende foranstaltninger'},
                                    {id: ' ', label: ''},
                                ]}
                            />
                            <TableBody>
                                {apv.risks.map((row, index) => (
                                    <ApvRiskTableRow
                                        key={index}
                                        row={row}
                                        selected={table.selected.includes(`${row.name}_${index}`)}
                                        onSelectRow={() => table.onSelectRow(`${row.name}_${index}`)}
                                    />
                                ))}

                                <TableEmptyRows
                                    height={68}
                                    emptyRows={emptyRows(table.page, table.rowsPerPage, apv.risks.length)}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </Paper>

            <Paper variant="outlined" sx={{p: 2, mb: 3}}>
                <Typography variant="h6">Sundhed og sikkerhed</Typography>
                <Stack component="ul">
                    {apv.healthSafety?.map((item: HealthSafetyModel, index: number) => (
                        <Box key={index} component="li" sx={{p: 1}}>
                            <Typography variant="subtitle1">{item.title}</Typography>
                            <Typography variant="body2">{item.description}</Typography>
                        </Box>
                    ))}
                </Stack>
            </Paper>

            <Paper variant="outlined" sx={{p: 2, mb: 3}}>
                <Typography variant="h6">Evaluering og opfølgning</Typography>
                <Stack component="ul">
                    {apv.evaluation?.map((item: EvaluationModel, index: number) => (
                        <Box key={index} component="li" sx={{p: 1}}>
                            <Typography variant="subtitle1">{item.title}</Typography>
                            <Typography variant="body2">{item.description}</Typography>
                        </Box>
                    ))}
                </Stack>
            </Paper>

            <Paper variant="outlined" sx={{p: 2, mb: 3}}>
                <Typography variant="h6">Konklusion</Typography>
                <Typography variant="body1">{apv.conclusion}</Typography>
            </Paper>
        </Box>
    );
}
