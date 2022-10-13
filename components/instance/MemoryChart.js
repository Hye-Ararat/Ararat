import { useEffect, useRef, useState } from "react";
import { InstanceStore } from "../../states/instance";
import {
    ArcElement,
    BarController,
    BarElement,
    BubbleController,
    CategoryScale,
    Chart,
    DoughnutController,
    LineController,
    LineElement,
    PieController,
    PointElement,
    PolarAreaController,
    RadarController,
    RadialLinearScale,
    ScatterController,
    LinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Title,
    Tooltip,
    SubTitle
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Fade, Grid, Paper, Typography } from "@mui/material";
import prettyBytes from "pretty-bytes";
import convert from "convert-units"

export default function MemoryChart() {
    const instance = {
        monitor: InstanceStore.useStoreState((state) => state.monitor),
        data: InstanceStore.useStoreState((state) => state.data)
    };
    const [memChart, setMemChart] = useState(null);
    const memRef = useRef(null);
    useEffect(() => {
        if (memChart) {
            let lastmem;
            var interval1 = setInterval(() => {
                if (!lastmem) {
                    lastmem = memChart.data.datasets[0].data[memChart.data.datasets[0].data.length - 1];
                }
                if (lastmem == memChart.data.datasets[0].data[memChart.data.datasets[0].data.length - 1]) {
                    memChart.data.datasets[0].data.push(lastmem);
                    if (memChart.data.datasets[0].data.length >= 11) {
                        memChart.data.datasets[0].data.shift();
                    }
                    memChart.update();
                } else {
                    lastmem = memChart.data.datasets[0].data[memChart.data.datasets[0].data.length - 1];
                }
            }, 1000);
        }

        return () => {
            if (interval1) {
                clearInterval(interval1);
            }
        };
    }, [memChart]);
    useEffect(() => {
        if (memChart) {
            if (instance.monitor.memory.usage != null) {
                console.log(instance.monitor);
                if (memChart) {
                    var newMemory = memChart.data.datasets[0].data;
                    newMemory.push(instance.monitor.memory.usage);
                    console.log(newMemory);
                    if (newMemory.length >= 11) {
                        newMemory.shift();
                    }
                    memChart.data.datasets[0].data = newMemory;
                    console.log(memChart.data.datasets[0].data);
                    memChart.update();
                }
            }
        }
    }, [memChart, instance.monitor.memory.usage]);
    useEffect(() => {
        console.log("a;lsdfj;adlsjf;laskdjf;lskdjf;laskdjfa");
        if (instance.data) {
            Chart.register(
                ArcElement,
                LineElement,
                BarElement,
                PointElement,
                BarController,
                BubbleController,
                DoughnutController,
                LineController,
                PieController,
                PolarAreaController,
                RadarController,
                ScatterController,
                CategoryScale,
                LinearScale,
                RadialLinearScale,
                TimeScale,
                TimeSeriesScale,
                Decimation,
                Filler,
                Title,
                Tooltip,
                SubTitle,
                ChartDataLabels
            );
            const memoryChart = memRef.current.getContext("2d");

            const memoryChartData = {
                labels: Array(10).fill(""),
                datasets: [
                    {
                        label: "Memory Usage",
                        fill: true,
                        backgroundColor: "#133542",
                        data: [],
                        datalabels: {
                            display: function (context) {
                                var index = context.dataIndex;
                                var value = context.dataset.data[index];
                                return index == context.dataset.data.length - 1 ? true : false;
                            },
                            color: "#fff",
                            align: "left",
                            backgroundColor: "rgba(13, 20, 29, 0.7)",
                            borderRadius: 5,
                            formatter: function (value) {
                                return (
                                    prettyBytes(parseInt(value), { binary: true }) +
                                    "/" +
                                    prettyBytes(convert(parseInt(instance.data.config["limits.memory"])).from(instance.data.config["limits.memory"].replace(/[^a-zA-Z]/g, "")).to("B"), { binary: true })
                                );
                            },
                            font: {
                                size: 15,
                                weight: 600,
                                family: "Inter"
                            }
                        },
                        elements: {
                            point: {
                                radius: function (context) {
                                    var index = context.dataIndex;
                                    return index == context.dataset.data.length - 1 ? 5 : 0;
                                },
                                pointBackgroundColor: "#09c2de"
                            }
                        }
                    }
                ]
            };
            var memoryChartOptions = {
                legend: {
                    display: false
                },
                animations: true,
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                    x: {
                        ticks: {
                            display: false
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            display: true,
                            drawBorder: false,
                            color: "rgba(255, 255, 255, 0.1)",

                        },
                        ticks: {
                            display: true,
                            callback: function (val, index) {
                                //only display first last and middle ticks (index only goes to 9)
                                if (index == 0 || index == 3 || index == 6 || index == 9) {
                                    return prettyBytes(val, { binary: true });
                                }
                            },
                            font: {
                                size: 10,
                                weight: 600,
                                family: "Inter"
                            }
                        },
                        beginAtZero: true,
                        max: convert(parseInt(instance.data.config["limits.memory"])).from(instance.data.config["limits.memory"].replace(/[^a-zA-Z]/g, "")).to("B")
                    }
                },
                elements: {
                    point: {
                        radius: 0
                    },
                    line: {
                        borderColor: "#09c2de",
                        tension: 0.3
                    }
                }
            };
            var memoryChartConfig = {
                type: "line",
                options: memoryChartOptions,
                data: memoryChartData
            };
            setMemChart(new Chart(memoryChart, memoryChartConfig));
        }
    }, [instance.data]);
    return (
        <>
            <Fade in={true} appear={true}>
                <Grid container xs={12} direction="row" sx={{ mt: 2, minHeight: "25vh", height: "100%" }}>
                    <Grid
                        container
                        xs={12}
                        direction="column"
                        sx={{ ml: "auto", width: "100%", height: "100%", minHeight: "25vh" }}
                    >
                        <Typography fontWeight="bold" sx={{ mb: 1 }}>
                            Memory
                        </Typography>
                        <Paper style={{ width: "100%", minHeight: "25vh" }}>
                            <canvas ref={memRef} />
                        </Paper>
                    </Grid>
                </Grid>
            </Fade>
        </>
    );
}
