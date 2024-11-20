import { forwardRef } from 'react';
import Box, { BoxProps } from '@mui/material/Box';

export type SvgColorProps = BoxProps & {
    src: string;
};

export const SvgColor = forwardRef<HTMLSpanElement, SvgColorProps>(
    ({ src, width = 24, height, className, sx, ...other }, ref) => (
        <Box
            ref={ref}
            component="span"
            className={`mnl__svg__color__root ${className}`}
            sx={{
                width,
                flexShrink: 0,
                height: height ?? width,
                display: 'inline-flex',
                bgcolor: 'currentColor',
                mask: `url(${src}) no-repeat center / contain`,
                WebkitMask: `url(${src}) no-repeat center / contain`,
                ...sx,
            }}
            {...other}
        />
    )
);
