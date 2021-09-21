import { Button, Skeleton, Typography, Fade, AppBar, Toolbar, Paper, Grid, Box, IconButton, Tooltip, CardMedia, CardActionArea, Chip, Badge, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Avatar } from "@material-ui/core"
import { useParams } from "react-router"
import React from "react"
import { getFirestore, doc, onSnapshot } from '@firebase/firestore'
import {
  Chart,
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
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Title,
  Tooltip as TooltipChartJS,
  SubTitle
} from 'chart.js'
import axios from "axios"
import {
  Add,
  Edit as EditIcon,
  Gavel
} from '@material-ui/icons'
import ChartDataLabels from 'chartjs-plugin-datalabels';


const database = getFirestore()

function OverviewContainer() {
  const { server, instance } = useParams()
  const [server_data, setServerData] = React.useState({
    name: null
  })
  const [minecraft_server_data, setMinecraftServerData] = React.useState()

  React.useEffect(() => {
    const docRef = doc(database, "instances", instance, "servers", server)
    onSnapshot((docRef), (doc) => {
      setServerData(doc.data())
    })
  }, [])
  React.useEffect(() => {
    axios.get('https://api.mcsrvstat.us/2/grmpixelmon.com').then((response) => {
      console.log(response.data)
      setMinecraftServerData(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }, [])

  React.useEffect(() => {
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
      LogarithmicScale,
      RadialLinearScale,
      TimeScale,
      TimeSeriesScale,
      Decimation,
      Filler,
      Title,
      TooltipChartJS,
      SubTitle,
      ChartDataLabels
    )
    var ctx = document.getElementById('cpuChart').getContext('2d')
    var ctx2 = document.getElementById('ramChart').getContext('2d')
    const ramChartData = {
      labels: Array(10).fill(''),
      datasets: [{
        label: 'Memory Usage',
        fill: true,
        backgroundColor: "#133542",
        data: [3.3, 3.5, 3.5, 3.3, 3.3, 3.5, 3.4, 3.6, 3.3, 3.3],
        datalabels: {
          display: function (context) {
            var index = context.dataIndex;
            var value = context.dataset.data[index]
            return index == 9 ? true : false
          },
          color: "#fff",
          align: 'left',
          formatter: function (value) {
            return value + 'GB/4GB'
          },
          font: {
            size: 15,
            weight: 600,
            family: 'Poppins'
          }
        },
        elements: {
          point: {
            radius: function (context) {
              var index = context.dataIndex;
              return index == 9 ? 5 : 0
            },
            pointBackgroundColor: '#09c2de'
          }
        }
      }],

    }
    const cpuChartData = {
      labels: Array(10).fill(''),
      datasets: [{
        label: 'CPU Usage',
        fill: true,
        backgroundColor: "#133542",
        data: [5, 15, 22, 3, 40, 50, 66, 33, 98, 30],
        datalabels: {
          display: function (context) {
            var index = context.dataIndex;
            var value = context.dataset.data[index]
            return index == 9 ? true : false
          },
          color: "#fff",
          align: 'left',
          formatter: function (value) {
            return value + '%'
          },
          font: {
            size: 15,
            weight: 600,
            family: 'Poppins'
          }
        },
        elements: {
          point: {
            radius: function (context) {
              var index = context.dataIndex;
              return index == 9 ? 5 : 0
            },
            pointBackgroundColor: '#09c2de'
          }
        }
      }],

    }
    const cpuChartOptions = {
      legend: {
        display: false
      },
      maintainAspectRatio: false,
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
            display: false,
            drawBorder: false
          },
          ticks: {
            display: false
          }
        }
      },
      elements: {
        point: {
          radius: 0
        },
        line: {
          borderColor: '#09c2de',
          tension: 0.3
        }
      },
    }
    const chartConfig = {
      type: 'line',
      options: cpuChartOptions,
      data: cpuChartData,
    };
    const ramChartConfig = {
      type: 'line',
      options: cpuChartOptions,
      data: ramChartData,
    };
    var cpuChart = new Chart(ctx, chartConfig)
    var ramChart = new Chart(ctx2, ramChartConfig)


  }, [])

  function getMinecraftMotd() {
    return { __html: minecraft_server_data.motd.html }
  }
  return (
    <React.Fragment>
      <Typography variant="h4">Server Overview</Typography>
      <Paper sx={{ mt: 2 }}>
        <Grid container direction="row" sx={{ p: 2 }}>
          <CardMedia id="serverImage" onMouseLeave={() => {
            var image = document.getElementById('overlay')
            image.style.display = 'none'
          }} onMouseOver={() => {
            var image = document.getElementById('overlay')
            image.style.display = ''
          }} sx={{ height: '64px', width: '64px' }} image={minecraft_server_data ? minecraft_server_data.icon : ""}>
            <Grid justifyContent="center" id="overlay" style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.3)', display: 'none' }}>
              <IconButton sx={{ width: '100%', height: '100%', ":hover": { background: 'none' } }}>
                <EditIcon />
              </IconButton>
            </Grid>
          </CardMedia>
          <Box sx={{ ml: 1 }}>
            {server_data.name ? <Fade in={true}><Typography variant="h6" sx={{display:{xs: 'none', lg: 'block'}}}>{server_data.name}</Typography></Fade> : <Skeleton width={100} height={30}></Skeleton>}
            {server_data.name ? <Fade in={true}><Typography variant="h6" sx={{display:{xs: 'block', lg: 'none'}, mt: 2}}>{server_data.name}</Typography></Fade> : ""}
            <Grid container direction="row" sx={{display: {xs: 'none', lg: 'flex'}}}>
              {minecraft_server_data ? <div style={{ marginTop: 3 }} dangerouslySetInnerHTML={getMinecraftMotd()} /> : ""}
              <Tooltip title="Edit">
                <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
              </Tooltip>

            </Grid>
          </Box>
          <Grid sx={{ ml: 'auto', width: 216, height: '20' }} container direction="row" item>
            <Typography style={{ marginLeft: 3 }} sx={{ mr: 'auto' }} variant="normal">Status:                    <Chip style={{ margin: 'auto', verticalAlign: 'middle', marginBottom: 2 }} color="success" size="small" label="Online" /></Typography>
            <Grid item container direction="row">
              <Button sx={{ m: 'auto' }} color="success" disabled variant="contained">Start</Button>
              <Button sx={{ m: 'auto' }} color="error" variant="contained">Stop</Button>
              <Button sx={{ m: 'auto' }} color="warning" variant="contained">Restart</Button>
            </Grid>


          </Grid>
        </Grid>

      </Paper>
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} md={2.5} lg={2}>
          <Paper sx={{ p: 1.5, mt: 2, height: '100%' }}>
            <Typography variant="h6">Server Info</Typography>
            <Grid sx={{ width: 360, height: '20' }} container direction="column">
              <Typography variant="normal">Server Address</Typography>
              <Typography style={{ marginBottom: 10 }} variant="normalNoBold">1.1.1.1</Typography>
              <Typography variant="normal">Server Version</Typography>
              <Typography style={{ marginBottom: 10 }} variant="normalNoBold">{minecraft_server_data ? minecraft_server_data.version : ""} </Typography>
              <Typography variant="normal">Players</Typography>
              <Typography variant="normalNoBold">{minecraft_server_data ? minecraft_server_data.players.online + "/" + minecraft_server_data.players.max + " Online" : ""} </Typography>
            </Grid>
          </Paper>
        </Grid>
        {/*Start*/}
        {minecraft_server_data ? minecraft_server_data.players.list ?
          <>
            <Grid item xs={12} md={3} lg={2.3}>
              <Paper sx={{ mt: 2, p: 1.5, height: '100%', position: 'relative' }}>
                <Typography variant="h6">Players Online</Typography>
                <Grid container sx={{ height: 175 }}>
                  {minecraft_server_data.players.list.slice(0, 3).map((player) => {
                    var uuid = minecraft_server_data.players.uuid[player]
                    return (
                      <>
                        <Grid container display="row" sx={{ mb: 1, mt: 1 }}>
                          <img style={{ marginRight: 3 }} height={30} src={`https://crafatar.com/avatars/${uuid}`} />
                          <Typography noWrap display="block" variant="normalNoBold">{player}</Typography>
                        </Grid>
                        <Divider />
                      </>
                    )
                  })
                  }
                  <Grid>
                    {minecraft_server_data.players.list.length - 3 > 0 ?
                      <Typography variant="body2"> and <Typography variant="normal">{minecraft_server_data.players.online - 3} others</Typography></Typography> : ""}
                  </Grid>
                </Grid>
                <Button sx={{position: 'absolute', bottom: 10}} size="small" variant="contained" >View All Players</Button>

              </Paper>
            </Grid>
            <Grid item xs={12} md={6.5} lg={4.2}>
              <Paper sx={{ mt: 2, p: 1.5, height: '100%', position: 'relative' }}>
                <Typography variant="h6">Recent Audits</Typography>
                <Grid container display="row" sx={{ mt: 1 }}>
                  <Typography variant="normal">Changed Server Icon</Typography>
                  <Typography sx={{ ml: 'auto', mt: 'auto' }} variant="body2">Today at 3:46 PM</Typography>
                </Grid>
                <Grid container display="row" sx={{ mt: 1 }}>
                  <Typography variant="normal">Changed Server Name</Typography>
                  <Typography sx={{ ml: 'auto', mt: 'auto' }} variant="body2">1 day ago</Typography>
                </Grid>
                <Grid container display="row" sx={{ mt: 1 }}>
                  <Typography variant="normal">Restarted Minecraft Server</Typography>
                  <Typography sx={{ ml: 'auto', mt: 'auto' }} variant="body2">2 days ago</Typography>
                </Grid>
                <Grid container display="row" sx={{ mt: 1 }}>
                  <Typography variant="normal">Changed MOTD</Typography>
                  <Typography sx={{ ml: 'auto', mt: 'auto' }} variant="body2">2 days ago</Typography>
                </Grid>
                <Grid container display="row" sx={{ mt: 1 }}>
                  <Typography variant="normal">Started Minecraft Server</Typography>
                  <Typography sx={{ ml: 'auto', mt: 'auto' }} variant="body2">2 days ago</Typography>
                </Grid>
                <Button  sx={{ position: 'absolute', bottom: 10 }} variant="contained" size="small">View Audit Log</Button>

              </Paper>
            </Grid>
          </> : "" : ""}
        <Grid item md={5} xs={12} lg={3.5}>
          <Paper sx={{ p: 1.5, mt: 2, height: '100%', position: 'relative' }}>
            <Typography variant="h6">Available Plugin Updates </Typography>
            <Typography variant="normalNoBold">Powered by Ararat Suggestions</Typography>
            <Grid container direction="row">
              <Grid sx={{ mt: 2 }} container direction="row">
                <img sx={{ marginTop: 15 }} height={30} src="https://www.spigotmc.org/data/resource_icons/9/9089.jpg?1564514296" />
                <Typography style={{ marginLeft: 3 }} variant="normalNoBold">EssentialsX</Typography>
                <Chip sx={{ ml: 'auto' }} size="small" color="warning" label="2.18.2 -> 2.19.0" />
              </Grid>
              <Grid sx={{ mt: 2 }} container direction="row">
                <img sx={{ marginTop: 15 }} height={30} src="https://www.spigotmc.org/data/resource_icons/28/28140.jpg?1490821714" />
                <Typography style={{ marginLeft: 3 }} variant="normalNoBold">LuckPerms</Typography>
                <Chip sx={{ ml: 'auto' }} size="small" color="info" label="5.3.0 -> 5.3.47" />
              </Grid>
              <Grid sx={{ mt: 2 }} container direction="row">
                <img sx={{ marginTop: 15 }} height={30} src="https://www.spigotmc.org/data/resource_icons/19/19254.jpg?1475607356" />
                <Typography style={{ marginLeft: 3 }} variant="normalNoBold">ViaVersion</Typography>
                <Chip sx={{ ml: 'auto' }} size="small" color="info" label="4.0.0 -> 4.0.1" />
              </Grid>



            </Grid>
            <Typography sx={{ mt: 1 , mb: 2}} variant="body2">and <Typography variant="normal">7 other updates</Typography></Typography>
            <Button sx={{ position: 'absolute', bottom: 10 }} size="small" variant="contained" >View All Updates</Button>

          </Paper>
        </Grid>


        {/*End*/}
        <Grid item xs={12} md={7} lg={3.5}>
          <Paper sx={{p: 1.5, mt: 2, height: '100%', position: 'relative' }}>
            <Typography variant="h6">Recent Tickets</Typography>
            <Divider />
            <Grid container direction="row">
              <Typography sx={{ mt: 2, mb: 2 }} display="block" variant="normal" noWrap={true}>The UI is stunning</Typography>
              <Chip sx={{ mt: 2, mb: 2, ml: 'auto' }} size="small" color="warning" label="Agent-Reply" />
            </Grid>
            <Divider />
            <Button sx={{ position: 'absolute', bottom: 10 }} size="small" variant="contained" >View All Tickets</Button>
          </Paper>
        </Grid>

        <Grid  item lg={3.5} md={5} xs={12}>
          <Paper sx={{ p: 1.5, mt: 2, height: '100%', position: 'relative' }}>
            <Typography variant="h6">Expiring Punishments </Typography>
            <Grid container direction="row" sx={{mb: 5}}>
              <Grid sx={{ mt: 2 }} container direction="row">
                <img sx={{ marginTop: 15 }} height={30} src="https://crafatar.com/avatars/b68cea71-52a6-43df-85c3-2afd6bf0ded6" />
                <Typography style={{ marginLeft: 3 }} variant="normalNoBold">Endermined</Typography>
                <Chip sx={{ ml: 'auto' }} size="small" color="info" label="4 Hours Remaining" />
              </Grid>
              <Grid sx={{ mt: 2 }} container direction="row">
                <img sx={{ marginTop: 15 }} height={30} src="https://crafatar.com/avatars/62ae805f-b78a-4dbb-ad46-b0cb24e26ec1" />
                <Typography style={{ marginLeft: 3 }} variant="normalNoBold">Ctech321</Typography>
                <Chip sx={{ ml: 'auto' }} size="small" color="info" label="3 Days Remaining" />
              </Grid>
              <Grid sx={{ mt: 2 }} container direction="row">
                <img sx={{ marginTop: 15 }} height={30} src="https://crafatar.com/avatars/fe742961-072b-432c-b929-8ca3b7a267e8" />
                <Typography style={{ marginLeft: 3 }} variant="normalNoBold">WolfoGaming</Typography>
                <Chip sx={{ ml: 'auto' }} size="small" color="info" label="13 Days Remaining" />
              </Grid>



            </Grid>
            <Button sx={{ position: 'absolute', bottom: 10}} size="small" variant="contained" >View All Punishments</Button>

          </Paper>
        </Grid>
        <Grid item md={3.5} xs={6} lg={2.5}>
          <Paper sx={{position: "relative", mt: 2, height: '100%'}}>
            <Typography sx={{ p: 1.5 }} variant="h6">CPU</Typography>
            <Box sx={{position: 'absolute', bottom: 0, width: '100%', height: '90%'}}>
              <canvas id="cpuChart"></canvas>
              </Box>
          </Paper>
        </Grid>
        <Grid item md={3.5} xs={6} lg={2.5}>
        <Paper sx={{position: "relative", mt: 2, height: '100%'}}>
            <Typography sx={{ p: 1.5 }} variant="h6">RAM</Typography>
            <Box sx={{position: 'absolute', bottom: 0, width: '100%', height: '90%'}}>
              <canvas id="ramChart"></canvas>
              </Box>
          </Paper>
        </Grid>
      </Grid>
      <Grid sx={{mt: 2}} justifyContent="space-between" container spacing={2} direction="row">

      </Grid>





    </React.Fragment>
  )
}


export default OverviewContainer