import type {CardProps} from '@mui/material/Card';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import {alpha as hexAlpha, useTheme} from '@mui/material/styles';
import {Chart, ChartOptions} from '../../../components/charts/Chart';
import {fNumber} from '../../../utils/FormatNumber';
import {useChart} from '../../../components/charts/UseChart';
import {useEffect, useState} from 'react';
import {fetchApvs, fetchApvStatsForChart} from '../../../firebase/ApvQueries';
import {CircularProgress, FormControl, InputLabel, Select} from '@mui/material';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import {EmployeeApvModel} from '../../../firebase/models/EmployeeApvModel';


type Props = CardProps & {
    title?: string;
    subheader?: string;
    chart: {
        colors?: string[];
        categories?: string[];
        series: {
            name: string;
            data: number[];
        }[];
        options?: ChartOptions;
    };
};

export function AnalyticsConversionRates({title, subheader, chart, ...other}: Props) {
    const theme = useTheme();
    const [chartData, setChartData] = useState<{ categories: string[]; series: any[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedApv, setSelectedApv] = useState<string>('RAUmCs9lvlPjhszpVk9G');
    const [apvs, setApvs] = useState<EmployeeApvModel[]>([]);

    const apvTypeTranslations = {
        employeeApv: 'Medarbejder APV',
        projectApv: 'Projekt APV',
    };

    useEffect(() => {
        if(selectedApv) {
            fetchApvStatsForChart(selectedApv).then((data) => {
                setChartData(data);
                setLoading(false);
            });
        }

        fetchApvs().then(d => {
            if(!selectedApv) {
                setSelectedApv(d.filter(d => d.apvType === 'employeeApv')[0].id)
            }
            setApvs(d)
        });

    }, [selectedApv]);


    const chartColors = chart.colors ?? [
        theme.palette.primary.dark,
        hexAlpha(theme.palette.primary.dark, 0.24),
    ];

    const chartOptions = useChart({
        colors: chartColors,
        stroke: {width: 2, colors: ['transparent']},
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: (value: number) => fNumber(value),
                title: {formatter: (seriesName: string) => `${seriesName}: `},
            },
            style: {
                fontSize: '12px',
            },
            theme: 'light',
        },
        xaxis: {categories: chartData?.categories},
        dataLabels: {
            enabled: true,
            offsetX: -6,
            style: {fontSize: '10px', colors: ['#FFFFFF', theme.palette.text.primary]},
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 2,
                barHeight: '100%',
                dataLabels: {position: 'top'},
            },
        },
        ...chart.options,
    });

    if (loading) {
        return <CircularProgress/>;
    }

    return (
        <Card {...other}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <CardHeader
                    title={title}
                    subheader={!chartData || !chartData.categories.length ? '' : `Sammenlignet mellem ${chartData.series[0].name} og ${chartData.series[1].name}`}
                />
                <FormControl variant="outlined" sx={{width: 200, marginX: 3, marginTop: 3}}>
                    <InputLabel>Vælg APV</InputLabel>
                    <Select
                        value={selectedApv}
                        onChange={(e) => setSelectedApv(e.target.value)}
                        label="Vælg APV"
                    >
                        {apvs.map((apv: EmployeeApvModel) => (
                            <MenuItem value={apv.id}>{apvTypeTranslations[apv.apvType]}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            {!chartData || !chartData.categories.length ? (
                <Box sx={{p: 3}}>Ingen dataer fundet</Box>
            ) : (
                <Chart
                    type="bar"
                    series={chartData.series}
                    options={chartOptions}
                    height={360}
                    sx={{py: 2.5, pl: 1, pr: 2.5}}
                />
            )}
        </Card>
    );
}
