import type {Breakpoint, SxProps, Theme} from '@mui/material/styles';
import {useTheme} from '@mui/material/styles';
import React, {useEffect, useState} from 'react';
import {Alert, Box} from '@mui/material';
import {SvgColor} from '../../../components/SvgColor';
import {NavDesktop, NavMobile} from '../Nav';
import {LayoutSection} from '../../auth/layout/core/LayoutSection';
import {HeaderSection} from '../../auth/layout/core/HeaderSection';
import {MenuButton} from '../../../components/MenuButton';
import {Searchbar} from '../../../components/Searchbar';
import {AccountPopover} from '../../../components/AccountPopover';
import {Iconify} from '../../../components/Iconify';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {db} from '../../../Firebase';
import {getAuth} from 'firebase/auth';
import {Outlet} from 'react-router-dom';

export type DashboardLayoutProps = {
    sx?: SxProps<Theme>;
    header?: {
        sx?: SxProps<Theme>;
    };
};

const icon = (name: string) => (
    <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`}/>
);

// export const _workspaces = [
//     {
//         id: 'team-1',
//         name: 'Team 1',
//         logo: `/assets/logos/c-k-vvs.png`,
//         plan: 'Free',
//     },
//     {
//         id: 'team-2',
//         name: 'Team 2',
//         logo: `/assets/icons/workspaces/logo-2.webp`,
//         plan: 'Pro',
//     },
//     {
//         id: 'team-3',
//         name: 'Team 3',
//         logo: `/assets/icons/workspaces/logo-3.webp`,
//         plan: 'Pro',
//     },
// ];

export const navData = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: icon('ic-analytics'),
    },
    {
        title: 'Projekter',
        path: '/projects',
        icon: icon('ic-projects'),
        // info: (
        //     <Label color="success" variant="inverted">
        //         +3
        //     </Label>
        // ),
    },
    {
        title: "APV'er",
        path: '/apvs',
        icon: icon('ic-apv'),
    },
    {
        title: 'Brugere',
        path: '/users',
        icon: icon('ic-user-group'),
    },
    {
        title: 'Aktiviteter',
        path: '/activities',
        icon: icon('ic-flag'),
    },
    {
        title: 'Opslag',
        path: '/posts',
        icon: icon('ic-post'),
    },
    {
        title: 'Virksomhed indstillinger',
        path: '/organization/settings',
        icon: icon('ic-settings'),
    },
];

export function DashboardLayout({sx, header}: DashboardLayoutProps) {
    const theme = useTheme();
    const [navOpen, setNavOpen] = useState(false);
    const layoutQuery: Breakpoint = 'lg';
    const [loading, setLoading] = useState(true);
    const [networks, setNetworks] = useState<any[]>([]);
    const user = getAuth().currentUser;

    useEffect(() => {
        if (!user?.uid) return;

        const fetchDocuments = async () => {
            try {
                const networksRef = collection(db, 'NETWORKS');
                const networksQuery = query(networksRef, where('users', 'array-contains', user.uid));
                const networksSnapshot = await getDocs(networksQuery);
                const networksData = networksSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNetworks(networksData);
            } catch (error) {
                console.error("Error fetching documents:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDocuments();
    }, [user?.uid]);

    if (loading) return <div>Loading...</div>;

    return (
        <LayoutSection
            headerSection={
                <HeaderSection
                    layoutQuery={layoutQuery}
                    slotProps={{
                        container: {
                            maxWidth: false,
                            sx: {px: {[layoutQuery]: 5}},
                        },
                    }}
                    sx={header?.sx}
                    slots={{
                        topArea: (
                            <Alert severity="info" sx={{display: 'none', borderRadius: 0}}>
                                This is an info Alert.
                            </Alert>
                        ),
                        leftArea: (
                            <>
                                <MenuButton
                                    onClick={() => setNavOpen(true)}
                                    sx={{
                                        ml: -1,
                                        [theme.breakpoints.up(layoutQuery)]: {display: 'none'},
                                    }}
                                />
                                <NavMobile
                                    data={navData}
                                    open={navOpen}
                                    onClose={() => setNavOpen(false)}
                                    workspaces={networks}
                                    // workspaces={_workspaces}
                                />
                            </>
                        ),
                        rightArea: (
                            <Box gap={1} display="flex" alignItems="center">
                                <Searchbar/>
                                {/*<LanguagePopover data={_langs} />*/}
                                {/*<NotificationsPopover data={_notifications} />*/}
                                <AccountPopover
                                    data={[
                                        {
                                            label: 'Profile',
                                            href: '/profile',
                                            icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone"/>,
                                        },
                                        {
                                            label: 'Settings',
                                            href: '/settings',
                                            icon: <Iconify width={22} icon="solar:settings-bold-duotone"/>,
                                        },
                                    ]}
                                />
                            </Box>
                        ),
                    }}
                />
            }
            sidebarSection={
                <NavDesktop
                    data={navData}
                    layoutQuery={layoutQuery}
                    workspaces={networks}
                    // workspaces={_workspaces}
                />
            }
            footerSection={null}
            cssVars={{
                '--layout-nav-vertical-width': '300px',
                '--layout-dashboard-content-pt': theme.spacing(1),
                '--layout-dashboard-content-pb': theme.spacing(8),
                '--layout-dashboard-content-px': theme.spacing(5),
            }}
            sx={{
                [`& .layout__has__sidebar`]: {
                    [theme.breakpoints.up(layoutQuery)]: {
                        pl: 'var(--layout-nav-vertical-width)',
                    },
                },
                ...sx,
            }}
        >
            <Box
                component="main"
                className='layout__main'
                sx={{
                    display: 'flex',
                    flex: '1 1 auto',
                    flexDirection: 'column',
                    ...sx,
                }}
            >
                <Outlet/>
            </Box>
        </LayoutSection>
    );
}
