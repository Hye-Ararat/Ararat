import { Button, Skeleton, Typography, Fade, AppBar, Toolbar, Paper, Grid, Box, IconButton, Tooltip, CardMedia, CardActionArea, Chip, Badge, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core"
import { useParams } from "react-router"
import React from "react"
import {getFirestore, doc, onSnapshot} from '@firebase/firestore'
import {  Chart,
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
  SubTitle} from 'chart.js'
import axios from "axios"
import {
  Edit as EditIcon
} from '@material-ui/icons'
import ChartDataLabels from 'chartjs-plugin-datalabels';


const database = getFirestore()

function OverviewContainer(){
  const {server, instance} = useParams()
  const [server_data, setServerData] = React.useState({
    name: null
  })
  const [suggestions, setSuggestions] = React.useState({
    correctPlayers: true
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
        fill:true,
        backgroundColor: "#133542",
        data: [3.3, 3.5, 3.5, 3.3, 3.3, 3.5, 3.4, 3.6, 3.3, 3.3],
        datalabels:{
          display: function(context){
            var index = context.dataIndex;
            var value = context.dataset.data[index]
            return index == 9 ? true : false
          },
          color: "#fff",
          align: 'left',
          formatter: function(value){
            return value + 'GB/4GB'
          },
          font: {
            size: 15,
            weight: 600,
            family: 'Poppins'
          }
        },
        elements:{
          point:{
            radius: function(context){
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
        fill:true,
        backgroundColor: "#133542",
        data: [5, 15, 22, 3, 40, 50, 66, 33, 98, 30],
        datalabels:{
          display: function(context){
            var index = context.dataIndex;
            var value = context.dataset.data[index]
            return index == 9 ? true : false
          },
          color: "#fff",
          align: 'left',
          formatter: function(value){
            return value + '%'
          },
          font: {
            size: 15,
            weight: 600,
            family: 'Poppins'
          }
        },
        elements:{
          point:{
            radius: function(context){
              var index = context.dataIndex;
              return index == 9 ? 5 : 0
            },
            pointBackgroundColor: '#09c2de'
          }
        }
      }],
      
    }
    const cpuChartOptions =  {
      legend:{
        display: false
      },
      scales: {
          x: {
              ticks: {
                  display: false
              },
              grid:{
                display: false
              }
          },
          y:{
            grid:{
              display: false,
              drawBorder: false
            },
            ticks:{
              display: false
            }
          }
      },
      elements:{
        point:{
          radius: 0
        },
        line:{
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

  function getMinecraftMotd(){
    return{__html: minecraft_server_data.motd.html}
  }
  return(
    <React.Fragment>
      <Typography variant="h4">Server Overview</Typography>
      <Paper sx={{mt: 2}}>
        <Grid container direction="row" sx={{p: 2}}>
        <CardMedia id="serverImage" onMouseLeave={() => {
          var image = document.getElementById('overlay')
          image.style.display = 'none'
        }} onMouseOver={() => {
          var image = document.getElementById('overlay')
          image.style.display = ''
        }} sx={{height: '64px', width: '64px'}} image={minecraft_server_data ? minecraft_server_data.icon : ""}>
          <Grid container justifyContent="center" id="overlay" style={{width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.3)', display: 'none'}}>
            <IconButton sx={{width: '100%', height: '100%', ":hover":{background: 'none'}}}>
              <EditIcon/>
            </IconButton>
          </Grid>
        </CardMedia>
        <Box sx={{ml: 1}}>
        {server_data.name ? <Fade in={true}><Typography variant="h6">{server_data.name}</Typography></Fade>  : <Skeleton width={100} height={30}></Skeleton>}
        <Grid container direction="row">
        {minecraft_server_data ?         <div style={{marginTop: 3}} dangerouslySetInnerHTML={getMinecraftMotd()} /> : "" }
        <Tooltip title="Edit">
        <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
        </Tooltip>

        </Grid>
        </Box>
        <Grid sx={{ml: 'auto', width: 230, height: '20'}} container direction="row" item>
        <Typography style={{marginLeft: 3}}sx={{mr: 'auto'}} variant="normal">Status:                    <Chip style={{margin: 'auto', verticalAlign: 'middle', marginBottom: 2}} color="success" size="small" label="Online" /></Typography>
          <Grid item container direction="row">
       <Button sx={{m: 'auto'}} color="success" disabled variant="contained">Start</Button>
       <Button sx={{m: 'auto'}} color="error" variant="contained">Stop</Button> 
       <Button sx={{m: 'auto'}} color="warning" variant="contained">Restart</Button> 
       </Grid>


       </Grid>
        </Grid>

      </Paper>
      <Grid container direction="row">
      <Paper sx={{width: 280, p: 1.5, mt: 2, maxHeight: 260}}>
        <Typography variant="h6">Server Info</Typography>
        <Grid sx={{width: 360, height: '20'}} container direction="column">
        <Typography variant="normal">Server Address</Typography>
        <Typography style={{marginBottom: 10}} variant="normalNoBold">1.1.1.1</Typography>
        <Typography variant="normal">Server Version</Typography>
        <Typography style={{marginBottom: 10}}  variant="normalNoBold">{minecraft_server_data ? minecraft_server_data.version: ""} </Typography>
        <Typography variant="normal">Players</Typography>
        <Typography variant="normalNoBold">{minecraft_server_data ? minecraft_server_data.players.online + "/" + minecraft_server_data.players.max + " Online": ""} </Typography>
        </Grid>
      </Paper>
      {/*Start*/}
      {minecraft_server_data ? minecraft_server_data.players.lsit ?minecraft_server_data.players.list.length == 12 && minecraft_server_data.players.online != minecraft_server_data.players.list.length ? 
      <>
      <Dialog open={suggestions.correctPlayers}
      onClose={() => alert('closed')}
      >
        <DialogTitle>Ararat Suggestions</DialogTitle>
        <DialogContent>
          <DialogContentText>Ararat Suggestions has detected that your server is not returning player data to Ararat correctly. To correct this issue, set enable_query=true in your server.properties file. Would you like Ararat Suggestions to automatically apply this fix?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setSuggestions({correctPlayers: false})}>Yes</Button>
          <Button variant="contained" onClick={() => setSuggestions({correctPlayers: false})} color="error">No</Button>
        </DialogActions>
        </Dialog>
        </>
      : "" : "" : ""}
      {minecraft_server_data ? minecraft_server_data.players.list ? 
      <Paper sx={{ml: 2, mt: 2, p: 1.5, maxWidth: 300, maxHeight: 260 }}>
        <Typography variant="h6">Players Online</Typography>
        <Grid container sx={{height: 175, width: 300}}>
        {minecraft_server_data.players.list.slice(0, 3).map((player) => {
          var uuid = minecraft_server_data.players.uuid[player]
          return(
            <>
            <Grid container display="row" sx={{mb: 1, mt: 1}}>
            <img style={{marginRight: 3}} height={30} src={`https://crafatar.com/avatars/${uuid}`} />
          <Typography variant="normalNoBold">{player}</Typography>
          </Grid>
                    <Divider />
                    </>
          )
        })
        }
              <Grid item>
                {minecraft_server_data.players.list.length - 3  > 0 ? 
                <Typography variant="body2"> and <Typography variant="normal">{minecraft_server_data.players.list.length - 3} others</Typography></Typography> : ""}
      </Grid>
         </Grid>
         <Button size="small" variant="contained" >View All Players</Button>

      </Paper> : "": ""}
      <Paper sx={{ml: 2, mt: 2, p: 1.5, width: 400, maxHeight: 260 }}>
        <Typography variant="h6">Recent Audits</Typography>
        <Grid container display="row" sx={{width: 370, mt: 1}}>
        <Typography variant="normal">Changed Server Icon</Typography>
        <Typography sx={{ml: 'auto', mt: 'auto'}} variant="body2">Today at 3:46 PM</Typography>
        </Grid>
        <Grid container display="row" sx={{width: 370, mt: 1}}>
        <Typography variant="normal">Changed Server Name</Typography>
        <Typography sx={{ml: 'auto', mt: 'auto'}} variant="body2">1 day ago</Typography>
        </Grid>
        <Grid container display="row" sx={{width: 370, mt: 1}}>
        <Typography variant="normal">Restarted Minecraft Server</Typography>
        <Typography sx={{ml: 'auto', mt: 'auto'}} variant="body2">2 days ago</Typography>
        </Grid>
        <Grid container display="row" sx={{width: 370, mt: 1}}>
        <Typography variant="normal">Changed MOTD</Typography>
        <Typography sx={{ml: 'auto', mt: 'auto'}} variant="body2">2 days ago</Typography>
        </Grid>
        <Grid container display="row" sx={{width: 370, mt: 1}}>
        <Typography variant="normal">Started Minecraft Server</Typography>
        <Typography sx={{ml: 'auto', mt: 'auto'}} variant="body2">2 days ago</Typography>
        </Grid>
        <Button sx={{mt: 2}}variant="contained" size="small">View Audit Log</Button>

      </Paper>
      <Paper  sx={{ml: 2, mt: 2, width: 604, maxHeight: 410 }}>
        <Grid container direction="row">
        <Box sx={{width: 302}}>
        <Typography sx={{p: 1.5}} variant="h6">CPU</Typography>

      <canvas id="cpuChart"></canvas>
      </Box>
      <Box sx={{width: 302}}>
        <Typography sx={{p: 1.5}} variant="h6">RAM</Typography>
      <canvas id="ramChart"></canvas>
      </Box>

      </Grid>
      <Typography sx={{ml: 1.5, mt: 1.5}} align="center" variant="h6">Disk: 12.3GB/50.0GB</Typography>
      </Paper>
            {/*End*/}
      </Grid>
    </React.Fragment>
  )
}


export default OverviewContainer