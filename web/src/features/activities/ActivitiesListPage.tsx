import React, {SyntheticEvent, useCallback, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import {Alert, Container, Snackbar, SnackbarCloseReason, Table, TableContainer} from '@mui/material';
import {Breakpoint, useTheme} from '@mui/material/styles';
import {Iconify} from '../../components/Iconify';
import {getNetworkId} from '../../utils/LocalStorage';
import {fetchActivities} from '../../firebase/ActivityQueries';
import {ActivityModel} from '../../firebase/models/ActivityModel';
import {ActivitiesDrawer} from './components/ActivitiesDrawer';
import {ActivitiesTableHead, ActivitiesTableToolbar, ActivityTableRow} from './components/table/ActivitiesTable';
import { Scrollbar } from '../../components/Scrollbar';
import TableBody from '@mui/material/TableBody';
import {TableLoadingData} from '../projects/components/table/ProjectsTable';
import {applyFilter, getComparator} from './components/table/utils';
import {TableNoData} from '../users/components/table/UsersTable';

const ProjectsPage = () => {
    const table = useTable();
    const theme = useTheme();
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const layoutQuery: Breakpoint = 'lg';
    const [open, setOpen] = useState(false);
    const [notificationState, setNotificationState] = useState<{title: string, show: boolean }>({title: '', show: false});
    const networkId = getNetworkId();
    const [selectedActivity, setSelectedActivity] = useState<ActivityModel | undefined>();
    const [filterTitle, setFilterTitle] = useState('');

    const handleNotificationClose = (event?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setNotificationState({title: '', show: false});
    };

    useEffect(() => {
        setSelectedActivity(undefined);

        fetchActivities().then((d: ActivityModel[]) => {
            setActivities(d);
            setLoading(false);
        })
    }, [notificationState, networkId]);

    const dataFiltered = applyFilter({
        inputData: activities,
        comparator: getComparator(table.order, table.orderBy),
        filterTitle,
    });

    const handleEditActivity = (activity: ActivityModel) => {
        setSelectedActivity(activity);
        setOpen(true);
    };

    const handleNotification = (title: string, value: boolean) => {
        setNotificationState({ title, show: value });
    };

    const notFound = !dataFiltered.length && !!filterTitle;

    return (
        <Container
            className='layout__main__content'
            maxWidth={'xl'}
            sx={{
                display: 'flex',
                flex: '1 1 auto',
                flexDirection: 'column',
                pt: 'var(--layout-dashboard-content-pt)',
                pb: 'var(--layout-dashboard-content-pb)',
                [theme.breakpoints.up(layoutQuery)]: {
                    px: 'var(--layout-dashboard-content-px)',
                },
            }}
        >
            <Box display="flex" alignItems="center" mb={5}>
                <Typography variant="h4" flexGrow={1}>
                    Aktiviteter
                </Typography>
                <Button
                    onClick={() => setOpen(true)}
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line"/>}
                >
                    Ny Aktivitet
                </Button>
            </Box>

            <Card>
                <ActivitiesTableToolbar
                    numSelected={table.selected.length}
                    filterName={filterTitle}
                    onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFilterTitle(event.target.value);
                        table.onResetPage();
                    }}
                />

                <Scrollbar
                    fillContent
                    sx={{ maxHeight: '80vh', overflowY: 'auto' }}
                >
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <ActivitiesTableHead
                                order={table.order}
                                orderBy={table.orderBy}
                                rowCount={activities.length}
                                numSelected={table.selected.length}
                                onSort={table.onSort}
                                onSelectAllRows={(checked) =>
                                    table.onSelectAllRows(
                                        checked,
                                        activities.map((activity) => activity.id)
                                    )
                                }
                                headLabel={[
                                    { id: 'title', label: 'Titel' },
                                    { id: 'description', label: 'Beskrivelse' },
                                    { id: 'fromDate', label: 'Fra d.' },
                                    { id: 'toDate', label: 'Til d.' },
                                    { id: '' },
                                ]}
                            />
                            <TableBody>
                                {loading ? (
                                    <TableLoadingData searchQuery={filterTitle} />
                                ) : (
                                    applyFilter({
                                        inputData: activities,
                                        comparator: getComparator(table.order, table.orderBy),
                                        filterTitle: filterTitle,
                                    })
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        .map((row: ActivityModel) => (
                                            <ActivityTableRow
                                                key={row.id}
                                                row={row}
                                                selected={table.selected.includes(row.id)}
                                                onSelectRow={() => table.onSelectRow(row.id)}
                                                notificationState={handleNotification}
                                                onEdit={() => handleEditActivity(row)}
                                            />
                                        ))
                                )}
                                {notFound && <TableNoData searchQuery={filterTitle} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
                <TablePagination
                    component="div"
                    page={table.page}
                    count={activities.length}
                    rowsPerPage={table.rowsPerPage}
                    onPageChange={table.onChangePage}
                    rowsPerPageOptions={[10, 20, 25]}
                    onRowsPerPageChange={table.onChangeRowsPerPage}
                />
            </Card>
            <ActivitiesDrawer
                open={open}
                displayDrawer={setOpen}
                notificationState={handleNotification}
                selectedActivity={selectedActivity}
            />
            <Snackbar
                open={notificationState.show}
                autoHideDuration={4000}
                onClose={handleNotificationClose}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={handleNotificationClose} severity="success" variant="filled">
                    {notificationState.title}
                </Alert>
            </Snackbar>
        </Container>
    );
}

const useTable = () => {
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState('title');
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [selected, setSelected] = useState<string[]>([]);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    const onSort = useCallback(
        (id: string) => {
            const isAsc = orderBy === id && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        },
        [order, orderBy]
    );

    const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
        if (checked) {
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    }, []);

    const onSelectRow = useCallback(
        (inputValue: string) => {
            const newSelected = selected.includes(inputValue)
                ? selected.filter((value) => value !== inputValue)
                : [...selected, inputValue];

            setSelected(newSelected);
        },
        [selected]
    );

    const onResetPage = useCallback(() => {
        setPage(0);
    }, []);

    const onChangePage = useCallback((event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const onChangeRowsPerPage = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            onResetPage();
        },
        [onResetPage]
    );

    return {
        page,
        order,
        onSort,
        orderBy,
        selected,
        rowsPerPage,
        onSelectRow,
        onResetPage,
        onChangePage,
        onSelectAllRows,
        onChangeRowsPerPage,
    };
}

export default ProjectsPage;
