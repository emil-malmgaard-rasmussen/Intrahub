import React, {SyntheticEvent, useCallback, useEffect, useState} from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import {Alert, Container, Snackbar, SnackbarCloseReason} from '@mui/material';
import {Breakpoint, useTheme} from '@mui/material/styles';
import {
    ProjectTableHead,
    ProjectTableRow,
    ProjectTableToolbar,
    TableEmptyRows,
    TableLoadingData,
    TableNoData
} from './components/table/ProjectsTable';
import {applyFilter, emptyRows, getComparator} from './components/table/utils';
import {_users} from '../../_data';
import {Iconify} from '../../components/Iconify';
import {Scrollbar} from '../../components/Scrollbar';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {ProjectsDrawer} from './components/ProjectsDrawer';
import {getNetworkId} from  '../../utils/LocalStorage';
import {db} from '../../Firebase';

const ProjectsPage = () => {
    const table = useTable();
    const theme = useTheme();
    const [filterName, setFilterName] = useState('');
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const layoutQuery: Breakpoint = 'lg';
    const [open, setOpen] = useState(false);
    const [notificationState, setNotificationState] = useState<{title: string, show: boolean }>({title: '', show: false});
    const networkId = getNetworkId();

    const handleNotificationClose = (event?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setNotificationState({title: '', show: false});
    };

    const handleNotificationChange = (title: string, value: boolean) => {
        setNotificationState({ title, show: value });
    };

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const projectsRef = collection(db, 'PROJECTS');
                const q = query(projectsRef, where('networkId', '==', networkId));
                const querySnapshot = await getDocs(q);

                const fetchedProjects = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setProjects(fetchedProjects);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [notificationState, networkId]);

    const dataFiltered = applyFilter({
        inputData: projects,
        comparator: getComparator(table.order, table.orderBy),
        filterName,
    });


    const notFound = !dataFiltered.length && !!filterName;

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
                    Projekter
                </Typography>
                <Button
                    onClick={() => setOpen(true)}
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line"/>}
                >
                    Nyt projekt
                </Button>
            </Box>

            <Card>
                <ProjectTableToolbar
                    numSelected={table.selected.length}
                    filterName={filterName}
                    onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFilterName(event.target.value);
                        table.onResetPage();
                    }}
                />

                <Scrollbar
                    fillContent
                    sx={{ maxHeight: '80vh', overflowY: 'auto' }}
                >
                    <TableContainer sx={{overflow: 'unset'}}>
                        <Table sx={{minWidth: 800}}>
                            <ProjectTableHead
                                order={table.order}
                                orderBy={table.orderBy}
                                rowCount={_users.length}
                                numSelected={table.selected.length}
                                onSort={table.onSort}
                                onSelectAllRows={(checked) =>
                                    table.onSelectAllRows(
                                        checked,
                                        _users.map((user) => user.id)
                                    )
                                }
                                headLabel={[
                                    {id: 'name', label: 'Name'},
                                    // {id: 'company', label: 'Company'},
                                    // {id: 'role', label: 'Role'},
                                    // {id: 'isVerified', label: 'Verified', align: 'center'},
                                    {id: 'status', label: 'Status'},
                                    {id: ''},
                                ]}
                            />
                            <TableBody>
                                <TableEmptyRows
                                    height={68}
                                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                                />
                                {loading ? (<TableLoadingData searchQuery={filterName}/>) : (dataFiltered
                                    .slice(
                                        table.page * table.rowsPerPage,
                                        table.page * table.rowsPerPage + table.rowsPerPage
                                    )
                                    .map((row) => (
                                        <ProjectTableRow
                                            key={row.id}
                                            row={row}
                                            selected={table.selected.includes(row.id)}
                                            onSelectRow={() => table.onSelectRow(row.id)}
                                            notificationState={handleNotificationChange}
                                        />
                                    )))}
                                {notFound && <TableNoData searchQuery={filterName}/>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
                <TablePagination
                    component="div"
                    page={table.page}
                    count={projects.length}
                    rowsPerPage={table.rowsPerPage}
                    onPageChange={table.onChangePage}
                    rowsPerPageOptions={[10, 20, 25]}
                    onRowsPerPageChange={table.onChangeRowsPerPage}
                />
            </Card>
            <ProjectsDrawer
                open={open}
                displayDrawer={setOpen}
                setNotificationState={handleNotificationChange}
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
    const [orderBy, setOrderBy] = useState('name');
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
