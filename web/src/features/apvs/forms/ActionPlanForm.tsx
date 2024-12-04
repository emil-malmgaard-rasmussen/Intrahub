import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface ActionPlanItem {
    issue: string;
    action: string;
    responsible: string;
    deadline: string;
    status: string;
}

const ActionPlanForm = () => {
    const [issue, setIssue] = useState('');
    const [action, setAction] = useState('');
    const [responsible, setResponsible] = useState('');
    const [deadline, setDeadline] = useState('');
    const [status, setStatus] = useState('In Progress');
    const [actionPlans, setActionPlans] = useState<ActionPlanItem[]>([]);

    const handleAddActionPlan = () => {
        if (issue && action && responsible && deadline) {
            const newActionPlan: ActionPlanItem = { issue, action, responsible, deadline, status };
            setActionPlans([...actionPlans, newActionPlan]);
            // Clear the input fields after adding the action plan
            setIssue('');
            setAction('');
            setResponsible('');
            setDeadline('');
            setStatus('In Progress');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Opret Handlingsplan</Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Stack spacing={2}>
                    <TextField
                        label="Identificeret Problem/Issue"
                        variant="outlined"
                        value={issue}
                        onChange={(e) => setIssue(e.target.value)}
                    />
                    <TextField
                        label="Handlingsforløb/Action"
                        variant="outlined"
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                    />
                    <TextField
                        label="Ansvarlig/Responsible"
                        variant="outlined"
                        value={responsible}
                        onChange={(e) => setResponsible(e.target.value)}
                    />
                    <TextField
                        label="Deadline"
                        type="date"
                        variant="outlined"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Button variant="contained" onClick={handleAddActionPlan}>
                        Tilføj Handlingsplan
                    </Button>
                </Stack>
            </Paper>

            <Typography variant="h6" gutterBottom>Handlingsplan Status</Typography>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Identificeret Problem</TableCell>
                            <TableCell>Handlingsforløb</TableCell>
                            <TableCell>Ansvarlig</TableCell>
                            <TableCell>Deadline</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {actionPlans.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.issue}</TableCell>
                                <TableCell>{item.action}</TableCell>
                                <TableCell>{item.responsible}</TableCell>
                                <TableCell>{item.deadline}</TableCell>
                                <TableCell>{item.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
