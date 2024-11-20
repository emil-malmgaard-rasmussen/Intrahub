import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {CustomTabPanel} from '../../../../components/tabs/CustomTabPanel';
import {useState} from 'react';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ManualApvTab from './ManualApvTab';

export interface ApvTabsProps {
    displayDrawer: (value: boolean) => void;
    showNotification: (value: boolean) => void;
}

export const a11yProps = (index: number) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export const ApvTabs = (props: ApvTabsProps) => {
    const {displayDrawer, showNotification} = props;
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Manuelt" {...a11yProps(0)} />
                    <Tab icon={<WorkspacePremiumIcon/>} iconPosition="end" label="AI"/>
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <ManualApvTab showNotification={showNotification} displayDrawer={displayDrawer} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                Item Two
            </CustomTabPanel>
        </Box>
    );
}
