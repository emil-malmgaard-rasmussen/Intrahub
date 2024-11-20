import React from 'react';
import {useFieldArray, useFormContext} from 'react-hook-form';
import { TextField, Button, IconButton, Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';

export const EvaluationSection = () => {
    const { register, control } = useFormContext()

    const { fields: evaluationFields, append: appendEvaluation, remove: removeEvaluation } = useFieldArray({
        control,
        name: "evaluation"
    });

    return (
        <Box sx={{ marginBottom: 4, width: '100%' }}>
            <Typography variant="h6">Evaluering og opfølgning</Typography>
            <Divider />
            {evaluationFields.map((field, index) => (
                <Grid container spacing={2} key={field.id} alignItems="flex-start" sx={{ marginBottom: 2, py: 2 }}>
                    <Grid size={{xs: 5}}>
                        <TextField
                            fullWidth
                            {...register(`evaluation.${index}.title`, {required: true})}
                            label="Titel"
                            placeholder="Angiv titel"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={{xs: 6}}>
                        <TextField
                            fullWidth
                            {...register(`evaluation.${index}.description`, {required: true})}
                            label="Beskrivelse"
                            placeholder="Angiv beskrivelse"
                            variant="outlined"
                            multiline
                            rows={3}
                        />
                    </Grid>
                    <Grid size={{xs: 1}}>
                        <IconButton color="error" onClick={() => removeEvaluation(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
            <Button variant="outlined" sx={{my: 2}} onClick={() => appendEvaluation({ title: '', description: '' })}>
                Tilføj felt til Evaluering og opfølgning
            </Button>
        </Box>
    )
}
