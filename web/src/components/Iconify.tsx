import { forwardRef } from 'react';
import { Icon, disableCache } from '@iconify/react';

import Box, {BoxProps} from '@mui/material/Box';
import {IconProps} from '@mui/material';

interface Custom {
    icon: string,
}

export type IconifyProps = BoxProps & IconProps & Custom;

export const Iconify = forwardRef<SVGElement, IconifyProps>(
  ({ className, width = 20, sx, ...other }, ref) => (
    <Box
      ssr
      ref={ref}
      component={Icon}
      className={`mnl__icon__root ${className}`}
      sx={{
        width,
        height: width,
        flexShrink: 0,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    />
  )
);

// https://iconify.design/docs/iconify-icon/disable-cache.html
disableCache('local');
