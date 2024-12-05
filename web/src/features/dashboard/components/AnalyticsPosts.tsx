import type {BoxProps} from '@mui/material/Box';
import Box from '@mui/material/Box';
import type {CardProps} from '@mui/material/Card';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';
import {Scrollbar} from '../../../components/Scrollbar';
import {Iconify} from '../../../components/Iconify';
import {FetchedPostModel} from '../../../firebase/models/PostModel';


type Props = CardProps & {
    title?: string;
    subheader?: string;
    list: FetchedPostModel[];
};

export function AnalyticsPosts({title, subheader, list, ...other}: Props) {
    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} sx={{mb: 1}}/>

            <Scrollbar sx={{maxHeight: 505}}>
                <Box>
                    {list.map((post) => (
                        <PostItem key={post.id} item={post}/>
                    ))}
                </Box>
            </Scrollbar>

            <Box sx={{p: 2, textAlign: 'right'}}>
                <Button
                    size="small"
                    color="inherit"
                    endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ml: -0.5}}/>}
                >
                    View all
                </Button>
            </Box>
        </Card>
    );
}

function PostItem({sx, item, ...other}: BoxProps & { item: Props['list'][number] }) {
    return (
        <Box
            sx={{
                py: 2,
                px: 3,
                gap: 2,
                display: 'flex',
                alignItems: 'center',
                borderBottom: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
                ...sx,
            }}
            {...other}
        >
            <Avatar
                variant="rounded"
                alt={item.title}
                src={item.imageUrl}
                sx={{width: 48, height: 48, flexShrink: 0}}
            />

            <ListItemText
                primary={item.title}
                secondary={item.text}
                primaryTypographyProps={{noWrap: true, typography: 'subtitle2'}}
                secondaryTypographyProps={{mt: 0.5, noWrap: true, component: 'span'}}
            />

            <Box sx={{flexShrink: 0, color: 'text.disabled', typography: 'caption'}}>
                {item.createdAt.toDate().toLocaleDateString()}
            </Box>
        </Box>
    );
}
