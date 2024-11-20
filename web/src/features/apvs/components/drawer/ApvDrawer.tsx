import Box from '@mui/material/Box';
import {Drawer, IconButton, Typography} from '@mui/material';
import {Iconify} from '../../../../components/Iconify';
import Divider from '@mui/material/Divider';
import {ApvTabs} from '../tabs/ApvTabs';

export interface ApvDrawerProps {
    open: boolean;
    displayDrawer: (value: boolean) => void;
    showNotification: (value: boolean) => void;
}

export const ApvDrawer = (props: ApvDrawerProps) => {
    const {open, displayDrawer, showNotification} = props;


    return (
        <Drawer open={open} onClose={() => displayDrawer(false)} anchor={'right'}>
            <Box
                sx={{
                    width: 800,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Box display="flex" alignItems="center" sx={{pl: 2.5, pr: 1.5, pt: 2}}>
                    <Typography variant="h6" flexGrow={1}>
                        Opret APV
                    </Typography>
                    <IconButton onClick={() => displayDrawer(false)}>
                        <Iconify icon="mingcute:close-line"/>
                    </IconButton>
                </Box>
                <Box sx={{pl: 2.5, pr: 1.5,}}>
                    <Typography variant="body2" flexGrow={1}>
                        Her kan du oprette APV'er, vi her 2 løsninger: Manuelt eller AI.
                    </Typography>
                </Box>
                <Divider/>
                <Box sx={{pl: 2.5, pr: 1.5, py: 2}}>
                    <ApvTabs displayDrawer={displayDrawer} showNotification={showNotification}/>
                </Box>
            </Box>
        </Drawer>
    );
};
