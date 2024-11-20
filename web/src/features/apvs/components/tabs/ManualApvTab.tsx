import React, {useState} from 'react';
import {Select, SelectChangeEvent} from '@mui/material';
import Grid from '@mui/material/Grid2';
import MenuItem from '@mui/material/MenuItem';
import ProjectApvType from '../apvtypes/ProjectApvType';
import EmployeeApvType from '../apvtypes/EmployeeApvType';

export interface ManualApvTabProps {
    displayDrawer: (value: boolean) => void;
    showNotification: (value: boolean) => void;
}

const ManualApvTab = (props: ManualApvTabProps) => {
    const {showNotification, displayDrawer} = props;
    const [selectedApvType, setSelectedApvType] = useState<'projectApv' | 'employeeApv'>();
    const apvType = [
        {label: 'Medarbejder-APV', value: 'employeeApv'},
        {label: 'Projekt-APV', value: 'projectApv'},
    ]

    const renderApvType = () => {
        switch (selectedApvType) {
            case 'projectApv':
                return (
                    <Grid size={{xs: 12}}>
                        <ProjectApvType showNotification={showNotification} displayDrawer={displayDrawer}/>
                    </Grid>
                )
            case 'employeeApv':
                return (
                    <Grid size={{xs: 12}}>
                        <EmployeeApvType displayDrawer={displayDrawer} showNotification={showNotification}/>
                    </Grid>
                )
            default:
                return null;
        }
    }

    const handleChange = (event: SelectChangeEvent<'projectApv' | 'employeeApv'>) => {
        setSelectedApvType(event.target.value as 'projectApv' | 'employeeApv');
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid container size={{xs: 12}}>
                    <Select
                        value={selectedApvType || ''}
                        onChange={handleChange}
                        sx={{width: '100%'}}
                        displayEmpty
                        variant="outlined"
                    >
                        <MenuItem value="" disabled>
                            Vælg APV-type
                        </MenuItem>
                        {apvType.map((apv) => (
                            <MenuItem key={apv.value} value={apv.value}>
                                {apv.label}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
                {renderApvType()}
            </Grid>
        </>
    );
};

export default ManualApvTab;
