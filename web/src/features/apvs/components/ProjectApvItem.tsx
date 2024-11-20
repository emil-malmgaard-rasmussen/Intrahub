import Box from '@mui/material/Box';
import {Link as RouterLink} from 'react-router-dom';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {Label} from '../../../components/Label';
import {ProjectApvModel} from '../../../firebase/models/ProjectApvModel';

export const ProjectApvItem = ({apv}: { apv: ProjectApvModel }) => {
    const renderProject = (
        <Label
            variant="inverted"
            color={'success'}
            sx={{
                zIndex: 9,
                top: 16,
                right: 16,
                position: 'absolute',
                textTransform: 'uppercase',
            }}
        >
            Projekt APV
        </Label>
    );

    const renderImg = (
        <Box
            component="img"
            alt=""
            src="/assets/images/post-placeholder.png"
            sx={{
                top: 0,
                width: 1,
                height: 1,
                objectFit: 'cover',
                position: 'absolute',
            }}
        />
    );

    return (
        <RouterLink to={`/apvs/project/${apv.id}`} style={{textDecoration: 'none'}}>
            <Card>
                <Box sx={{pt: '100%', position: 'relative'}}>
                    {renderProject}
                    {renderImg}
                </Box>
                <Stack spacing={2} sx={{p: 3}}>
                    <Typography color="inherit" variant="subtitle2" noWrap>
                        Projekt: {apv.project.name}
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle1">
                            <Typography
                                component="span"
                                variant="body1"
                                sx={{
                                    color: 'text.disabled',
                                }}
                            >
                                Start: {apv.startDate.toDate().toLocaleDateString()}
                            </Typography>
                        </Typography>
                    </Box>
                </Stack>
            </Card>
        </RouterLink>
    );
}
