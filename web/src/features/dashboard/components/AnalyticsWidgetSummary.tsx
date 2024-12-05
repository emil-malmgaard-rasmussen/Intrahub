import type {CardProps} from '@mui/material/Card';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import {useTheme} from '@mui/material/styles';
import {ColorType} from '../../../theme/core/palette';
import {ChartOptions} from '../../../components/charts/Chart';
import {fPercent, fShortenNumber} from '../../../utils/FormatNumber';
import {Iconify} from '../../../components/Iconify';
import {bgGradient} from '../../../theme/styles/mixins';
import {varAlpha} from '../../../theme/styles/utils';
import {SvgColor} from '../../../components/SvgColor';
import {Link} from 'react-router-dom';

type Props = CardProps & {
    title: string;
    total: number;
    percent?: number;
    color?: ColorType;
    icon: React.ReactNode;
    navigateTo?: string
    chart: {
        series: number[];
        categories: string[];
        options?: ChartOptions;
    };
};

export function AnalyticsWidgetSummary({
                                           icon,
                                           title,
                                           total,
                                           chart,
                                           percent,
                                           color = 'primary',
                                           navigateTo,
                                           sx,
                                           ...other
                                       }: Props) {
    const theme = useTheme();

    const renderTrending = (
        <Box
            sx={{
                top: 16,
                gap: 0.5,
                right: 16,
                display: 'flex',
                position: 'absolute',
                alignItems: 'center',
            }}
        >
            <Iconify width={20} icon={percent! < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'}/>
            <Box component="span" sx={{typography: 'subtitle2'}}>
                {percent! > 0 && '+'}
                {fPercent(percent)}
            </Box>
        </Box>
    );

    return (
        <Link to={navigateTo ? navigateTo : ''}>
            <Card
                sx={{
                    ...bgGradient({
                        color: `135deg, ${varAlpha(theme.vars.palette[color].lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette[color].lightChannel, 0.48)}`,
                    }),
                    p: 3,
                    boxShadow: 'none',
                    position: 'relative',
                    color: `${color}.darker`,
                    backgroundColor: 'common.white',
                    cursor: 'pointer',
                    ...sx,
                }}
                {...other}
            >
                <Box sx={{width: 48, height: 48, mb: 3}}>{icon}</Box>

                {percent && renderTrending}

                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Box sx={{flexGrow: 1, minWidth: 112}}>
                        <Box sx={{mb: 1, typography: 'subtitle2'}}>{title}</Box>
                        <Box sx={{typography: 'h4'}}>{fShortenNumber(total)}</Box>
                    </Box>

                    {/*<Chart*/}
                    {/*  type="line"*/}
                    {/*  series={[{ data: chart.series }]}*/}
                    {/*  options={chartOptions}*/}
                    {/*  width={84}*/}
                    {/*  height={56}*/}
                    {/*/>*/}
                </Box>

                <SvgColor
                    src="/assets/icons/dashboard/background/card-bg.svg"
                    sx={{
                        top: 0,
                        left: -20,
                        width: 240,
                        zIndex: -1,
                        height: 240,
                        opacity: 0.24,
                        position: 'absolute',
                        color: `${color}.main`,
                    }}
                />
            </Card>
        </Link>
    );
}
