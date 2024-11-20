import type { BoxProps } from '@mui/material/Box';
import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import {RouterLink} from '../features/auth/components/RouterLink';

export type LogoProps = BoxProps & {
    href?: string;
    isSingle?: boolean;
    disableLink?: boolean;
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
    (
        { width, href = '/', height, isSingle = true, disableLink = false, className, sx, ...other },
        ref
    ) => {

        const singleLogo = (
            <svg
                width="400"
                height="40"
                viewBox="-10 15 400 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g id="SvgjsG1014" fill="#000">
                    <path fillRule="nonzero" d="M0,0 H383 V77 H0,0 z M4,4 v69 h375 v-69 z"></path>
                </g>
                <g id="SvgjsG1015" transform="matrix(1.675, 0, 0, 1.675, 11.636, -4.906)" fill="#000">
                    <path
                        d="M3.2031 40 l0 -28.711 l7.4414 0 l0 28.711 l-7.4414 0 z M36.856656 11.289 l7.4414 0 l0 28.711 l-8.8477 0 l-10.957 -18.633 l0 18.633 l-7.4414 0 l0 -28.711 l8.75 0 l11.055 18.535 l0 -18.535 z M68.39846875 11.289 l0 6.4648 l-6.4844 0 l0 22.246 l-7.3633 0 l0 -22.246 l-6.5039 0 l0 -6.4648 l20.352 0 z M95.91784375 40 l-8.8281 0 l-7.4805 -12.305 l0 12.305 l-7.4414 0 l0 -28.711 l10.996 0 c6.875 0 9.6094 3.9453 9.6094 8.8672 c0 4.043 -2.3828 6.4063 -5.8203 7.1484 z M85.68384375 20.234 c0 -1.7578 -0.99609 -2.8711 -3.75 -2.8711 l-2.3242 0 l0 5.7617 l2.3242 0 c2.7539 0 3.75 -1.1328 3.75 -2.8906 z M118.84796875 40 l-1.8555 -5.3125 l-11.484 0 l-1.8359 5.3125 l-7.5586 0 l10.566 -28.711 l9.1602 0 l10.566 28.711 l-7.5586 0 z M107.63696875 28.555 l7.2266 0 l-3.6133 -10.391 z M147.8315625 11.289 l7.4414 0 l0 28.711 l-7.4414 0 l0 -11.191 l-10.586 0 l0 11.191 l-7.4414 0 l0 -28.711 l7.4414 0 l0 11.113 l10.586 0 l0 -11.113 z M172.8315625 40.39063 c-6.5625 0 -11.758 -2.9883 -11.758 -10.781 l0 -18.32 l7.4414 0 l0 17.305 c0 4.082 1.9141 5.293 4.3164 5.293 s4.3164 -1.2109 4.3164 -5.293 l0 -17.305 l7.4414 0 l0 18.32 c0 7.793 -5.1953 10.781 -11.758 10.781 z M207.1095 24.766 c3.0469 0.9375 5.0781 2.9297 5.0781 7.0313 c0 5 -2.793 8.2031 -9.5508 8.2031 l-12.246 0 l0 -28.711 l9.668 0 c6.8945 0 10.098 2.9102 10.098 8.0273 c0 2.4023 -0.97656 4.3555 -3.0469 5.4492 z M200.1955 17.363 l-2.6563 0 l0 5.0781 l2.6563 0 c2.4805 0 3.1445 -1.1133 3.1445 -2.6367 c0 -1.4453 -0.83984 -2.4414 -3.1445 -2.4414 z M201.1915 33.7109 c3.2031 0 3.7891 -1.3867 3.7891 -2.7539 c0 -1.3477 -0.50781 -2.9102 -3.7891 -2.9102 l-3.6523 0 l0 5.6641 l3.6523 0 z"></path>
                </g>
            </svg>
        );

        const baseSize = {
            width: width ?? 170,
            height: height ?? 60,
        };

        return (
            <Box
                ref={ref}
                component={RouterLink}
                href={href}
                className={`mnl__logo__root ${className}`}
                aria-label="Logo"
                sx={{
                    ...baseSize,
                    flexShrink: 0,
                    display: 'inline-flex',
                    verticalAlign: 'middle',
                    ...(disableLink && {pointerEvents: 'none'}),
                    ...sx,
                }}
            >
                {singleLogo}
            </Box>
        );
    }
);
