import type {BoxProps} from '@mui/material/Box';
import Box from '@mui/material/Box';
import type {Props} from 'react-apexcharts';
import ApexChart from 'react-apexcharts';

export type ChartProps = {
    type: Props['type'];
    series: Props['series'];
    options: Props['options'];
};


export type ChartOptions = Props['options'];


export function Chart({
                          sx,
                          type,
                          series,
                          height,
                          options,
                          className,
                          width = '100%',
                          ...other
                      }: BoxProps & ChartProps) {
    return (
        <Box
            dir="ltr"
            className={`mnl__chart__root ${className}`}
            sx={{
                width,
                height,
                flexShrink: 0,
                borderRadius: 1.5,
                position: 'relative',
                ...sx,
            }}
            {...other}
        >
            <ApexChart type={type} series={series} options={options} width="100%" height="100%"/>
        </Box>
    );
}
