import type {CardProps} from '@mui/material/Card';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import {Link} from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {SvgColor} from './SvgColor';
import {varAlpha} from '../theme/styles/utils';
import {PostModel} from '../firebase/models/PostModel';

export function PostItem({
                             sx,
                             post,
                             postId,
                             latestPost,
                             latestPostLarge,
                             ...other
                         }: CardProps & {
    post: PostModel;
    latestPost: boolean;
    latestPostLarge: boolean;
    postId: string;
}) {
    const renderAvatar = (
        <Avatar
            sx={{
                left: 24,
                zIndex: 9,
                bottom: -24,
                position: 'absolute',
                ...((latestPostLarge || latestPost) && {
                    top: 24,
                }),
            }}
        />
    );

    const renderTitle = (
        <Typography
            color="inherit"
            variant="subtitle2"
            sx={{
                height: 44,
                overflow: 'hidden',
                WebkitLineClamp: 2,
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                ...(latestPostLarge && {typography: 'h5', height: 60}),
                ...((latestPostLarge || latestPost) && {
                    color: 'common.white',
                }),
            }}
        >
            {post.title}
        </Typography>
    );

    const renderBio = (
        <Typography
            color="inherit"
            variant="subtitle2"
            sx={{
                height: 44,
                overflow: 'hidden',
                WebkitLineClamp: 2,
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                ...(latestPostLarge && {typography: 'h5', height: 60}),
                ...((latestPostLarge || latestPost) && {
                    color: 'common.white',
                }),
            }}
        >
            {post.bio}
        </Typography>
    );

    const renderCover = (
        <Box
            component="img"
            alt={post.title}
            src={post.imageUrl ? post.imageUrl : '/assets/images/post-placeholder.png'}
            sx={{
                top: 0,
                width: 1,
                height: 1,
                objectFit: post.imageUrl ? 'contain' : 'cover',
                position: 'absolute',
            }}
        />
    );

    const renderDate = (
        <Typography
            variant="caption"
            component="div"
            sx={{
                mb: 1,
                color: 'text.disabled',
                ...((latestPostLarge || latestPost) && {
                    opacity: 0.48,
                    color: 'common.white',
                }),
            }}
        >
            {post.createdAt.toDate().toLocaleDateString()}
        </Typography>
    );

    const renderShape = (
        <SvgColor
            width={88}
            height={36}
            src="/assets/icons/shape-avatar.svg"
            sx={{
                left: 0,
                zIndex: 9,
                bottom: -16,
                position: 'absolute',
                color: 'background.paper',
                ...((latestPostLarge || latestPost) && {display: 'none'}),
            }}
        />
    );

    return (
        <Link to={`/posts/${postId}`}>
            <Card sx={sx} {...other}>
                <Box
                    sx={(theme) => ({
                        position: 'relative',
                        pt: 'calc(100% * 3 / 4)',
                        ...((latestPostLarge || latestPost) && {
                            pt: 'calc(100% * 4 / 3)',
                            '&:after': {
                                top: 0,
                                content: "''",
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                bgcolor: varAlpha(theme.palette.grey['900Channel'], 0.72),
                            },
                        }),
                        ...(latestPostLarge && {
                            pt: {
                                xs: 'calc(100% * 4 / 3)',
                                sm: 'calc(100% * 3 / 4.66)',
                            },
                        }),
                    })}
                >
                    {renderShape}
                    {renderAvatar}
                    {renderCover}
                </Box>

                <Box
                    sx={(theme) => ({
                        p: theme.spacing(6, 3, 3, 3),
                        ...((latestPostLarge || latestPost) && {
                            width: 1,
                            bottom: 0,
                            position: 'absolute',
                        }),
                    })}
                >
                    {renderDate}
                    {renderTitle}
                    {renderBio}
                </Box>
            </Card>
        </Link>
    );
}
