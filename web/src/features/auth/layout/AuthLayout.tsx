import {type Breakpoint, type SxProps, type Theme, useTheme} from '@mui/material/styles';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';

import {stylesMode} from '../../../theme/styles/utils';
import Box from '@mui/material/Box';
import {LayoutSection} from './core/LayoutSection';
import {HeaderSection} from './core/HeaderSection';
import {RouterLink} from '../components/RouterLink';
import {Logo} from '../../../components/Logo';

export type AuthLayoutProps = {
    sx?: SxProps<Theme>;
    children: React.ReactNode;
    header?: {
        sx?: SxProps<Theme>;
    };
};

export function AuthLayout({sx, children, header, ...other}: AuthLayoutProps) {
    const layoutQuery: Breakpoint = 'md';
    const theme = useTheme();

    const renderContent = (
        <Box
            sx={{
                py: 5,
                px: 3,
                width: 1,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.default',
                maxWidth: 'var(--layout-auth-content-width)',
            }}
        >
            {children}
        </Box>
    );

    return (
        <LayoutSection
            headerSection={
                <HeaderSection
                    layoutQuery={layoutQuery}
                    slotProps={{
                        container: {maxWidth: false},
                        toolbar: {sx: {bgcolor: 'transparent', backdropFilter: 'unset'}},
                    }}
                    sx={{
                        position: {[layoutQuery]: 'fixed'},

                        ...header?.sx,
                    }}
                    slots={{
                        topArea: (
                            <Alert severity="info" sx={{display: 'none', borderRadius: 0}}>
                                This is an info Alert.
                            </Alert>
                        ),
                        leftArea: <Logo />,
                        rightArea: (
                            <Link
                                component={RouterLink}
                                href="#"
                                color="inherit"
                                sx={{ typography: 'subtitle2' }}
                            >
                                Need help?
                            </Link>
                        ),
                    }}
                />
            }
            footerSection={null}
            cssVars={{'--layout-auth-content-width': '420px'}}
            sx={{
                '&::before': {
                    width: 1,
                    height: 1,
                    zIndex: -1,
                    content: "''",
                    opacity: 0.24,
                    position: 'fixed',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    backgroundImage: `url(/assets/background/overlay.jpg)`,
                    [stylesMode.dark]: {opacity: 0.08},
                },
                ...sx,
            }}
        >
            <Box
                component="main"
                className={'layout__main'}
                sx={{
                    display: 'flex',
                    flex: '1 1 auto',
                    alignItems: 'center',
                    flexDirection: 'column',
                    p: theme.spacing(3, 2, 10, 2),
                    [theme.breakpoints.up(layoutQuery)]: {
                        justifyContent: 'center',
                        p: theme.spacing(10, 0, 10, 0),
                    },
                    ...sx,
                }}
                {...other}
            >
                {renderContent}
            </Box>
        </LayoutSection>
    );
}
