import type {LinkProps} from 'react-router-dom';
import {Link} from 'react-router-dom';

import {forwardRef} from 'react';

interface RouterLinkProps extends Omit<LinkProps, 'to'> {
    href: string;
}

export const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(
    ({href, ...other}, ref) => <Link ref={ref} to={href} {...other} />
);
