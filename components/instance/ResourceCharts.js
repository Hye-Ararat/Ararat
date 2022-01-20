import { useEffect, useState } from "react"
import { InstanceStore } from "../../states/instance"
import { ArcElement, BarController, BarElement, BubbleController, CategoryScale, Chart, DoughnutController, LineController, LineElement, PieController, PointElement, PolarAreaController, RadarController, RadialLinearScale, ScatterController, LinearScale, TimeScale, TimeSeriesScale, Decimation, Filler, Title, Tooltip, SubTitle } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"
import { Grid, Paper, Typography } from "@mui/material";
import prettyBytes from "pretty-bytes"

export default function ResourceCharts() {
    const instance = {
        monitor: InstanceStore.useStoreState(state => state.monitor),
        data: InstanceStore.useStoreState(state => state.data),
    }
    const [memChart, setMemChart] = useState(null)
    const [cpuChart, setCpuChart] = useState(null)
    useEffect(() => {
        if (cpuChart && memChart) {
            if (memChart) {
                let lastmem;
                setInterval(() => {
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
                }, 1000)
            }
            if (cpuChart) {
                let lastcpu;
                setInterval(() => {
                    if (!lastcpu) {
                        lastcpu = cpuChart.data.datasets[0].data[cpuChart.data.datasets[0].data.length - 1];
                    }
                    if (lastcpu == cpuChart.data.datasets[0].data[cpuChart.data.datasets[0].data.length - 1]) {
                        cpuChart.data.datasets[0].data.push(lastcpu);
                        if (cpuChart.data.datasets[0].data.length >= 11) {
                            cpuChart.data.datasets[0].data.shift();
                        }
                        cpuChart.update();
                    } else {
                        lastcpu = cpuChart.data.datasets[0].data[cpuChart.data.datasets[0].data.length - 1];
                    }
                }, 1000)
            }
        }
    }, [memChart, cpuChart])
    useEffect(() => {
        if (cpuChart && memChart) {
            if (instance.monitor.memory.usage != null) {
                console.log(instance.monitor)
                if (memChart) {
                    var newMemory = memChart.data.datasets[0].data
                    newMemory.push(parseInt(instance.monitor.memory.usage));
                    console.log(newMemory)
                    if (newMemory.length >= 11) {
                        newMemory.shift()
                    }
                    memChart.data.datasets[0].data = newMemory
                    console.log(memChart.data.datasets[0].data)
                    memChart.update()
                }
            }
            if (instance.monitor.cpu != null) {
                console.log(instance.monitor)
                if (cpuChart) {
                    console.log(cpuChart)
                    var newCPU = cpuChart.data.datasets[0].data
                    console.log(newCPU)
                    newCPU.push(parseInt(instance.monitor.cpu));
                    console.log(newCPU)
                    if (newCPU.length >= 11) {
                        newCPU.shift()
                    }
                    cpuChart.data.datasets[0].data = newCPU
                    console.log(cpuChart.data.datasets[0].data)
                    cpuChart.update()
                }
            }
        }
    }, [memChart, instance.monitor.memory.usage, cpuChart])
    useEffect(() => {
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

        )
        const memoryChart = document.getElementById("memoryChart").getContext("2d");
        const cpuChart = document.getElementById("cpuChart").getContext("2d");

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
                        formatter: function (value) {
                            return prettyBytes(value) + "/" + prettyBytes(parseInt(instance.data.limits.memory.limit.includes("GB") ? parseInt(instance.data.limits.memory.limit) * 1073741824 : parseInt(instance.data.limits.memory.limit) * 1048576), { binary: true });
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
        }

        const cpuChartData = {
            labels: Array(10).fill(""),
            datasets: [
                {
                    label: "CPU Usage",
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
                        formatter: function (value) {
                            return value + "%";
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
        }
        var memoryChartOptions = {
            legend: {
                display: false,
            },
            animations: true,
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                x: {
                    ticks: {
                        display: false,
                    },
                    grid: {
                        display: false,
                    },
                },
                y: {
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                    ticks: {
                        display: false,
                    },
                    beginAtZero: true,
                    max: 4294967296,
                },
            },
            elements: {
                point: {
                    radius: 0,
                },
                line: {
                    borderColor: "#09c2de",
                    tension: 0.3,
                },
            },
        }

        var cpuChartOptions = {
            legend: {
                display: false,
            },
            animations: true,
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                x: {
                    ticks: {
                        display: false,
                    },
                    grid: {
                        display: false,
                    },
                },
                y: {
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                    ticks: {
                        display: false,
                    },
                    beginAtZero: true,
                    max: 100,
                },
            },
            elements: {
                point: {
                    radius: 0,
                },
                line: {
                    borderColor: "#09c2de",
                    tension: 0.3,
                },
            },
        }
        var memoryChartConfig = {
            type: "line",
            options: memoryChartOptions,
            data: memoryChartData
        }
        setMemChart(new Chart(memoryChart, memoryChartConfig))
        var cpuChartConfig = {
            type: "line",
            options: cpuChartOptions,
            data: cpuChartData
        }
        setCpuChart(new Chart(cpuChart, cpuChartConfig))

    }, [])
    return (
        <>
            <Grid container xs={12} direction="row" sx={{ mt: 2 }}>
                <Grid conatiner xs={5.5} direction="column" sx={{ mr: "auto", width: "100%" }}>
                    <Typography fontWeight="bold">CPU</Typography>
                    <Paper style={{ width: "100%" }}>
                        <canvas id="cpuChart" />
                    </Paper>
                </Grid>
                <Grid container xs={5.5} direction="column" sx={{ ml: "auto", width: "100%" }}>
                    <Typography fontWeight="bold">Memory</Typography>
                    <Paper style={{ width: "100%" }}>
                        <canvas id="memoryChart" />
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}