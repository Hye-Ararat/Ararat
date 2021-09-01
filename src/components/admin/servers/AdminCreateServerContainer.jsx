import AdminDashboard from "../AdminDashboard"
import axios from "axios"
import {
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Container,
  Skeleton,
  Card,
  CardContent,
  CardActions,
  Fade,
  Grid,
  HorizontalStepper,
  CardMedia
} from '@material-ui/core'
import FinalStep from './create/FinalStep'
import { positions } from '@material-ui/system'
import {
  Link
} from 'react-router-dom'
import { makeStyles } from '@material-ui/styles';
import React from "react"
const useStyles = makeStyles({
  media: {
    height: 140,
  },
});
function AdminCreateServerContainer() {
  const classes = useStyles()
  
  const [step, setStep] = React.useState(0)
  const [data, setData] = React.useState({})
  const [versionStep, setVersionStep] = React.useState()
  const [imageStep, setImageStep] = React.useState()
  const [CollectedData, setCollectedData] = React.useState({
    type: null,
    magmacube: null,
    version: null,
    serverinfo: null,
    image: null
  })
  const RenderStep = () => {
     switch (step) {
       case 0:
         return (
           <>
          <Card sx={{ width: 275, height: 290, m: 3 }}>
          <CardMedia
          className={classes.media}
          image="https://cdn.thenewstack.io/media/2020/08/edd38e1d-thing.png"
          title="Contemplative Reptile"
        />
            <CardContent>
              <Typography variant="h5" component="div">
                N-VPS
              </Typography>
              <Typography variant="body2">
                Near bare-metal performance Linux instances based on LXC.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => { setCollectedData({...CollectedData, type: 'N-VPS'}); setStep(1) }}>Select</Button>
            </CardActions>
          </Card>
          <Card sx={{ width: 275, m: 3, height: 290 }}>
          <CardMedia
          className={classes.media}
          image="https://3kllhk1ibq34qk6sp3bhtox1-wpengine.netdna-ssl.com/wp-content/uploads/2017/01/how-to-deploy-java-apps-with-docker-a-quick-tutorial@3x.png"
          title="Contemplative Reptile"
        />
            <CardContent>
              <Typography variant="h5" component="div">
                Docker
              </Typography>
              <Typography variant="body2">
                Isolated high performance Linux instances.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => { setCollectedData({...CollectedData, type: 'Docker'}); setStep(1) }}>Select</Button>
            </CardActions>
          </Card>
          <Card sx={{ width: 275, m: 3, height: 290 }}>
          <CardMedia
          className={classes.media}
          image="https://media.discordapp.net/attachments/775877227573149707/881598139193249792/unknown.png"
          title="Contemplative Reptile"
        />
            <CardContent>
              <Typography variant="h5" component="div">
                KVM
              </Typography>
              <Typography variant="body2">
                Virtual Machines that virtualize at the kernel level.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => { setCollectedData({...CollectedData, type: 'KVM'}); setStep(1) }}>Select</Button>
            </CardActions>
          </Card>
          </>
         )
         break;
       case 1:

         var collectedCubes = data.filter(cube => cube.type == CollectedData.type)
         console.log(collectedCubes)
         if (collectedCubes == []) {

         } else {
          
          return (
            <>
            {collectedCubes.map(cube => {return(<Card sx={{ width: 275, m: 3 }}>
            <CardMedia
            className={classes.media}
            image={cube.icon? cube.icon : "https://cdn.pling.com/img/d/3/5/1/9c30e1a29f830fb3ee50c350e7e62476df63.png"}
            title="Contemplative Reptile"
          />
              <CardContent>
                <Typography variant="h5" component="div">
                  {cube.name}
                </Typography>
                <Typography variant="body2">
                  {cube.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => {
                  if (cube.images) {
                    setVersionStep(
                    <Step>
                      <StepLabel>Magma Block</StepLabel>
                    </Step>
                    
               
                    )
                    setImageStep(<Step>
                      <StepLabel>Image</StepLabel>
                    </Step>)
                  }
                  setCollectedData({...CollectedData, magmacube: cube}) 
                  setStep(2) 
                  }}>Select</Button>
              </CardActions>
            </Card>)
          })}
            </>
           )
         }
        
         break;
       case 2:
         if (versionStep != undefined) {
          return (
            <>
            {Object.keys(CollectedData.magmacube.images).map(key => {
              var d = CollectedData.magmacube.images[key]
              return(<Card sx={{ width: 275, m: 3 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {key}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => {
setCollectedData({...CollectedData, version: key}) 
                  setStep(3) 
                  }}>Select</Button>
              </CardActions>
            </Card>)
          })}
            </>
           )
         } else {
          return <FinalStep Data={CollectedData} />
         }
         
         break;
      case 3:
        if (versionStep != undefined) {
          return (
            <>
            {CollectedData.magmacube.images[CollectedData.version].map(key => {

              return(<Card sx={{ width: 275, m: 3 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {key.alias}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => {
setCollectedData({...CollectedData, image: key}) 
                  setStep(4) 
                  }}>Select</Button>
              </CardActions>
            </Card>)
          })}
            </>
           )
        } else {
          
        }
        break;
      case 4:
        return <FinalStep Data={CollectedData} />
       default:
         break;
     }
  }
  React.useEffect(() => {
    axios.get('http://api.hye.gg:3000/api/v1/admin/magma_cubes').then(function (response) {
      console.log(response.data) 
      setData(response.data)
    })
  }, [])
  return (
    <AdminDashboard page="servers">
      <Typography fontWeight={500} variant="h4" component="h4">
        Create Server
      </Typography>
      <Container>

        <Stepper sx={{mt: 2}}activeStep={step}>
          <Step>
            <StepLabel>Type</StepLabel>
          </Step>
          <Step>
            <StepLabel>Magma Cube</StepLabel>

          </Step>
          {versionStep}
          {imageStep}
          <Step>
            <StepLabel>Server Info</StepLabel>

          </Step>
        </Stepper>
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <RenderStep />
         
        </Grid>
      </Container>
    </AdminDashboard>
  )
}

export default AdminCreateServerContainer