import { useState, useCallback } from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { Iconify } from '../../../../components/Iconify';
import {varAlpha} from '../../../../theme/styles/utils';
import {useNavigate} from 'react-router-dom';

export const SeeMoreEmployeeApvButton = ({apvId}: {apvId: string}) => {
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
    const navigate = useNavigate();

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    return (
        <>
            <Button
                disableRipple
                color="inherit"
                onClick={(e) => {
                    e.preventDefault();
                    handleOpenPopover(e);
                }}
                endIcon={
                    <Iconify
                        icon={openPopover ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'}
                        sx={{
                            ml: -0.5,
                        }}
                    />
                }
                sx={{
                    bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                }}
            >
                Handling
            </Button>

            <Popover
                open={!!openPopover}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                <MenuList
                    disablePadding
                    sx={{
                        p: 0.5,
                        gap: 0.5,
                        width: 160,
                        display: 'flex',
                        flexDirection: 'column',
                        [`& .${menuItemClasses.root}`]: {
                            px: 1,
                            gap: 2,
                            borderRadius: 0.75,
                            [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
                        },
                    }}
                >
                    <MenuItem
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/apvs/${apvId}/see-action-plan`);
                            handleClosePopover();
                        }}
                    >
                        Se handlingsplan
                    </MenuItem>
                    <MenuItem
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/apvs/${apvId}/create-action-plan`);
                            handleClosePopover();
                        }}
                    >
                        Tilføj handlingsplan
                    </MenuItem>
                </MenuList>
            </Popover>
        </>
    );
}
