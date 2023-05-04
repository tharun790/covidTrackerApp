import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
// import chartData from './chart-data/total-growth-bar-chart';

const status = [
    {
        value: 'active',
        label: 'Active Cases'
    },
    {
        value: 'recovered',
        label: 'Recovered Cases'
    },
    {
        value: 'deceased',
        label: 'Deceased Cases'
    }
];

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading, data }) => {
    const [value, setValue] = useState('active');
    const [chartGraphData, setChartGraphData] = useState('active');
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);

    const { navType } = customization;
    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey200 = theme.palette.grey[200];
    const grey500 = theme.palette.grey[500];

    const primary200 = theme.palette.primary[200];
    const primaryDark = theme.palette.primary.dark;
    const secondaryMain = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;

    let newChartData = {};

    async function chartCreation(data, type) {
        if (data && Object.keys(data).length) {
            const stateList = Object.keys(data);
            let seriesData = [];
            if (type == "active") {
                for (let obj in data) {
                    seriesData.push(Number(data[obj].activeCases))
                }
            }
            else if (type == "recovered") {
                for (let obj in data) {
                    seriesData.push(Number(data[obj].recoveredCases))
                }
            }
            else if (type == "deceased") {
                for (let obj in data) {
                    seriesData.push(Number(data[obj].deceasedCases))
                }
            }

            newChartData = {
                height: 480,
                type: 'bar',
                options: {
                    chart: {
                        id: 'bar-chart',
                        stacked: true,
                        toolbar: {
                            show: true
                        },
                        zoom: {
                            enabled: true
                        }
                    },
                    responsive: [
                        {
                            breakpoint: 480,
                            options: {
                                legend: {
                                    position: 'bottom',
                                    offsetX: -10,
                                    offsetY: 0
                                }
                            }
                        }
                    ],
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '50%'
                        }
                    },
                    xaxis: {
                        type: 'category',
                        categories: stateList
                    },
                    legend: {
                        show: true,
                        fontSize: '12px',
                        fontFamily: `'Roboto', sans-serif`,
                        position: 'bottom',
                        offsetX: 20,
                        labels: {
                            useSeriesColors: false
                        },
                        markers: {
                            width: 16,
                            height: 16,
                            radius: 5
                        },
                        itemMargin: {
                            horizontal: 15,
                            vertical: 8
                        }
                    },
                    fill: {
                        type: 'solid'
                    },
                    dataLabels: {
                        enabled: false
                    },
                    grid: {
                        show: true
                    }
                },
                series: [
                    {
                        name: type,
                        data: seriesData
                    }
                ]
            }
            console.log("new chart data", newChartData)

            setChartGraphData(newChartData);
        }
        else {
            newChartData = {
                height: 480,
                type: 'bar',
                options: {
                    chart: {
                        id: 'bar-chart',
                        stacked: true,
                        toolbar: {
                            show: true
                        },
                        zoom: {
                            enabled: true
                        }
                    },
                    responsive: [
                        {
                            breakpoint: 480,
                            options: {
                                legend: {
                                    position: 'bottom',
                                    offsetX: -10,
                                    offsetY: 0
                                }
                            }
                        }
                    ],
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '50%'
                        }
                    },
                    xaxis: {
                        type: 'category',
                        categories: []
                    },
                    legend: {
                        show: true,
                        fontSize: '14px',
                        fontFamily: `'Roboto', sans-serif`,
                        position: 'bottom',
                        offsetX: 20,
                        labels: {
                            useSeriesColors: false
                        },
                        markers: {
                            width: 16,
                            height: 16,
                            radius: 5
                        },
                        itemMargin: {
                            horizontal: 15,
                            vertical: 8
                        }
                    },
                    fill: {
                        type: 'solid'
                    },
                    dataLabels: {
                        enabled: false
                    },
                    grid: {
                        show: true
                    }
                },
                series: [
                    {
                        name: 'Investment',
                        data: [35, 125, 35, 35, 35, 80, 35, 20, 35, 45, 15, 75]
                    },
                    {
                        name: 'Loss',
                        data: [35, 15, 15, 35, 65, 40, 80, 25, 15, 85, 25, 75]
                    },
                    {
                        name: 'Profit',
                        data: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10]
                    },
                    {
                        name: 'Maintenance',
                        data: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0]
                    }
                ]
            }
            setChartGraphData(newChartData);
        }
    }

    let stateListObj = {};
    if(data && data.length){
        data.forEach(val => {
            stateListObj[val.state] = val
        })
    }

    useEffect(() => {
        chartCreation(stateListObj, value)

        // do not load chart when loading
        if (!isLoading) {
            ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
        }
    }, [navType, primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, isLoading, grey500, value]);
    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Typography variant="subtitle2">Overall Graph summary</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="standard-select-currency"
                                        select
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                    >
                                        {status.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Chart {...chartGraphData} />
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

TotalGrowthBarChart.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
