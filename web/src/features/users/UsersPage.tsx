import {useCallback, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import {Container} from '@mui/material';
import {Breakpoint, useTheme} from '@mui/material/styles';
import {applyFilter, emptyRows, getComparator} from './components/table/utils';
import {Iconify} from '../../components/Iconify';
import {Scrollbar} from '../../components/Scrollbar';
import {
    TableEmptyRows,
    TableNoData,
    UsersProps,
    UsersTableHead,
    UserTableRow,
    UserTableToolbar
} from './components/table/UsersTable';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {db} from '../../Firebase';
import LocalStorage from '../../utils/LocalStorage';

const UsersPage = () => {
    const table = useTable();
    const theme = useTheme();
    const [users, setUsers] = useState<any>([]);
    const [filterName, setFilterName] = useState('');
    const layoutQuery: Breakpoint = 'lg';
    const networkId = LocalStorage.getNetworkId();

    const fetchNetwork = async () => {
        try {
            const networkRef = collection(db, 'NETWORKS');
            const q = query(networkRef, where("id", "==", networkId));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                // const networkData = querySnapshot.docs[0].data();
                // return networkData.users || [];
                return querySnapshot.docs[0].data();
            } else {
                console.warn("Network not found");
                return [];
            }
        } catch (error) {
            console.error("Error fetching network:", error);
            return [];
        }
    };

    const fetchUsersByUIDs = async (network: any) => {
        try {
            if (network.users.length === 0) return [];

            const usersRef = collection(db, 'USERS');
            const userQuery = query(usersRef, where('uid', 'in', network.users));
            const userSnapshot = await getDocs(userQuery);

            return userSnapshot.docs.map((doc) => ({
                uid: doc.id,
                role: network.administrators.includes(doc.data().uid) ? 'Admin' : 'Bruger',
                ...doc.data(),
            }));
        } catch (error) {
            console.error("Error fetching users by UIDs:", error);
            return [];
        }
    };

    useEffect(() => {
        const loadUsers = async () => {
            const network = await fetchNetwork();
            const fetchedUsers = await fetchUsersByUIDs(network);
            setUsers(fetchedUsers);
        };
        loadUsers();
    }, []);

    const dataFiltered: UsersProps[] = applyFilter({
        inputData: users,
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
                    Brugere
                </Typography>
                <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line"/>}
                >
                    Ny bruger
                </Button>
            </Box>

            <Card>
                <UserTableToolbar
                    numSelected={table.selected.length}
                    filterName={filterName}
                    onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFilterName(event.target.value);
                        table.onResetPage();
                    }}
                />

                <Scrollbar>
                    <TableContainer sx={{overflow: 'unset'}}>
                        <Table sx={{minWidth: 800}}>
                            <UsersTableHead
                                order={table.order}
                                orderBy={table.orderBy}
                                rowCount={users.length}
                                numSelected={table.selected.length}
                                onSort={table.onSort}
                                onSelectAllRows={(checked) =>
                                    table.onSelectAllRows(
                                        checked,
                                        users.map((user: any) => user.uid)
                                    )
                                }
                                headLabel={[
                                    {id: 'name', label: 'Name'},
                                    {id: 'email', label: 'E-mail'},
                                    {id: 'role', label: 'Rolle'},
                                    {id: 'isVerified', label: 'Verificeret', align: 'center'},
                                    {id: ''},
                                ]}
                            />
                            <TableBody>
                                {dataFiltered
                                    .slice(
                                        table.page * table.rowsPerPage,
                                        table.page * table.rowsPerPage + table.rowsPerPage
                                    )
                                    .map((row) => (
                                        <UserTableRow
                                            key={row.uid}
                                            row={row}
                                            selected={table.selected.includes(row.uid)}
                                            onSelectRow={() => table.onSelectRow(row.uid)}
                                        />
                                    ))}

                                <TableEmptyRows
                                    height={68}
                                    emptyRows={emptyRows(table.page, table.rowsPerPage, users.length)}
                                />

                                {notFound && <TableNoData searchQuery={filterName}/>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    component="div"
                    page={table.page}
                    count={users.length}
                    rowsPerPage={table.rowsPerPage}
                    onPageChange={table.onChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={table.onChangeRowsPerPage}
                />
            </Card>
        </Container>
    );
}

export const useTable = () => {
    const [page, setPage] = useState(0);
    const [orderBy, setOrderBy] = useState('name');
    const [rowsPerPage, setRowsPerPage] = useState(5);
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

export default UsersPage;
