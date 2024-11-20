import React from 'react';
import {useFieldArray, useFormContext} from 'react-hook-form';
import {Box, Button, IconButton, TextField, Typography} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';

export const HealthSafetySection = () => {
    const {register, control} = useFormContext()

    const {fields: healthSafetyFields, append: appendHealthSafety, remove: removeHealthSafety} = useFieldArray({
        control,
        name: "healthSafety"
    });

    return (
        <Box sx={{marginBottom: 4, width: '100%'}}>
            <Typography variant="h6">Sundhed og sikkerhed</Typography>
            <Divider/>
            {healthSafetyFields.map((field, index) => (
                <Grid container spacing={2} key={field.id} alignItems="flex-start" sx={{marginBottom: 2, py: 2}}>
                    <Grid size={{xs: 5}}>
                        <TextField
                            fullWidth
                            {...register(`healthSafety.${index}.title`, {required: true})}
                            label="Titel"
                            placeholder="Angiv titel"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={{xs: 6}}>
                        <TextField
                            fullWidth
                            {...register(`healthSafety.${index}.description`, {required: true})}
                            label="Beskrivelse"
                            placeholder="Angiv beskrivelse"
                            variant="outlined"
                            multiline
                            rows={3}
                        />
                    </Grid>
                    <Grid size={{xs: 1}}>
                        <IconButton color="error" onClick={() => removeHealthSafety(index)}>
                            <DeleteIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
            <Button variant="outlined" sx={{my: 2}} onClick={() => appendHealthSafety({title: '', description: ''})}>
                Tilføj felt til Sundhed og sikkerhed
            </Button>
        </Box>
    )
}
