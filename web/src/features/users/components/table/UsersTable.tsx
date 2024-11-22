import {
    OutlinedInput,
    TableCell,
    TableHead,
    TableRow,
    TableRowProps,
    TableSortLabel,
    Toolbar,
    Tooltip
} from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import {visuallyHidden} from './utils';
import {useCallback, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import {Iconify} from '../../../../components/Iconify';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import MenuItem, {menuItemClasses} from '@mui/material/MenuItem';

type TableEmptyRowsProps = TableRowProps & {
    emptyRows: number;
    height?: number;
};

export const TableEmptyRows = ({emptyRows, height, sx, ...other}: TableEmptyRowsProps) => {
    if (!emptyRows) {
        return null;
    }

    return (
        <TableRow
            sx={{
                ...(height && {
                    height: height * emptyRows,
                }),
                ...sx,
            }}
            {...other}
        >
            <TableCell colSpan={9}/>
        </TableRow>
    );
}
type TableNoDataProps = TableRowProps & {
    searchQuery: string;
};

export const TableNoData = ({searchQuery, ...other}: TableNoDataProps) => {
    return (
        <TableRow {...other}>
            <TableCell align="center" colSpan={7}>
                <Box sx={{py: 15, textAlign: 'center'}}>
                    <Typography variant="h6" sx={{mb: 1}}>
                        Ikke fundet
                    </Typography>

                    <Typography variant="body2">
                        Ingen resultater for &nbsp;
                        <strong>&quot;{searchQuery}&quot;</strong>.
                        <br /> Tjek for stavefejl i søgefeltet.
                    </Typography>
                </Box>
            </TableCell>
        </TableRow>
    );
}

type UsersTableHeadProps = {
    orderBy: string;
    rowCount: number;
    numSelected: number;
    order: 'asc' | 'desc';
    onSort: (id: string) => void;
    headLabel: Record<string, any>[];
    onSelectAllRows: (checked: boolean) => void;
};

export const UsersTableHead = ({
                                   order,
                                   onSort,
                                   orderBy,
                                   rowCount,
                                   headLabel,
                                   numSelected,
                                   onSelectAllRows,
                               }: UsersTableHeadProps) => {
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            onSelectAllRows(event.target.checked)
                        }
                    />
                </TableCell>

                {headLabel.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align || 'left'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{width: headCell.width, minWidth: headCell.minWidth}}
                    >
                        <TableSortLabel
                            hideSortIcon
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={() => onSort(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box sx={{...visuallyHidden}}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export type UsersProps = {
    uid: string;
    displayName: string;
    role: string;
    company: string;
    avatarUrl: string;
    isVerified: boolean;
    email: string;
};

type UsersTableRowProps = {
    row: UsersProps;
    selected: boolean;
    onSelectRow: () => void;
};

export const UserTableRow = ({row, selected, onSelectRow}: UsersTableRowProps) => {
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox disableRipple checked={selected} onChange={onSelectRow}/>
                </TableCell>

                <TableCell component="th" scope="row">
                    <Box gap={2} display="flex" alignItems="center">
                        <Avatar alt={row.displayName} src={row.avatarUrl}/>
                        {row.displayName}
                    </Box>
                </TableCell>

                <TableCell>{row.email}</TableCell>

                <TableCell>{row.role}</TableCell>

                <TableCell align="center">
                    {row.isVerified ? (
                        <Iconify width={22} icon="solar:check-circle-bold" sx={{color: 'success.main'}}/>
                    ) : (
                        '-'
                    )}
                </TableCell>

                <TableCell align="right">
                    <IconButton onClick={handleOpenPopover}>
                        <Iconify icon="eva:more-vertical-fill"/>
                    </IconButton>
                </TableCell>
            </TableRow>

            <Popover
                open={!!openPopover}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <MenuList
                    disablePadding
                    sx={{
                        p: 0.5,
                        gap: 0.5,
                        width: 140,
                        display: 'flex',
                        flexDirection: 'column',
                        [`& .${menuItemClasses.root}`]: {
                            px: 1,
                            gap: 2,
                            borderRadius: 0.75,
                            [`&.${menuItemClasses.selected}`]: {bgcolor: 'action.selected'},
                        },
                    }}
                >
                    <MenuItem onClick={handleClosePopover}>
                        <Iconify icon="solar:pen-bold"/>
                        Edit
                    </MenuItem>

                    <MenuItem onClick={handleClosePopover} sx={{color: 'error.main'}}>
                        <Iconify icon="solar:trash-bin-trash-bold"/>
                        Delete
                    </MenuItem>
                </MenuList>
            </Popover>
        </>
    );
}

type TableTableToolbarProps = {
    numSelected: number;
    filterName: string;
    onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const UserTableToolbar = ({numSelected, filterName, onFilterName}: TableTableToolbarProps) => {
    return (
        <Toolbar
            sx={{
                height: 96,
                display: 'flex',
                justifyContent: 'space-between',
                p: (theme) => theme.spacing(0, 1, 0, 3),
                ...(numSelected > 0 && {
                    color: 'primary.main',
                    bgcolor: 'primary.lighter',
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography component="div" variant="subtitle1">
                    {numSelected} selected
                </Typography>
            ) : (
                <OutlinedInput
                    fullWidth
                    value={filterName}
                    onChange={onFilterName}
                    placeholder="Søg brugere..."
                    startAdornment={
                        <InputAdornment position="start">
                            <Iconify width={20} icon="eva:search-fill" sx={{color: 'text.disabled'}}/>
                        </InputAdornment>
                    }
                    sx={{maxWidth: 320}}
                />
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <Iconify icon="solar:trash-bin-trash-bold"/>
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <Iconify icon="ic:round-filter-list"/>
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}
