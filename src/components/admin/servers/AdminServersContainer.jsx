import AdminDashboard from "../AdminDashboard"
import {
    Typography,
    Button,
    SvgIcon,
    Paper,
    CircularProgress
} from '@material-ui/core'
import {
    FindInPage as NoResultsIcon
} from '@material-ui/icons'
import {DataGrid, GridOverlay} from '@material-ui/data-grid'

import {
    Link,
    useParams
} from 'react-router-dom'
import {getFirestore, query, onSnapshot, collection} from '@firebase/firestore'
import React from "react"
import { Box } from "@material-ui/system"
function NoServers(){
    const {instance} = useParams()
    return(
        <GridOverlay>
            <Box textAlign="center">
            <Typography>There are no servers on this instance.</Typography>
            <Button sx={{mt: 1 }}variant="contained" component={Link} to={`/admin/instance/${instance}/servers/create`}>Create One</Button>
            </Box>
        </GridOverlay>
    )
}
function Loading(){
    return(
        <GridOverlay style={{backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'}}>
        <CircularProgress />
        </GridOverlay>
    )
}

function Toolbar(){
    const {instance} = useParams()

    return(
        <Box m={1} display="flex"justifyContent="flex-end">
        <Button variant="contained" size="small" component={Link} to={`/admin/instance/${instance}/servers/create`} align="right">Create</Button>
        </Box>
    )
}

const database = getFirestore()
function AdminServersContainer(){
    const {instance} = useParams()
    const [servers, setServers] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [columns, setColumns] = React.useState([{field: 'name', headerName: 'Name', width: 130}, {field: "memory", headerName: "Memory", width: 137, valueGetter: (params) => {
        console.log(params.row)
        let result = []
        if (params.row.limits.memory){
            result.push(params.row.limits.memory)
        }
        return result
    }}])
    React.useEffect(() => {
        const q = query(collection(database, `/instances/${instance}/servers`))
        onSnapshot(q, (querySnapshot) => {
            if (querySnapshot.docs.length == 0){
                setServers([])
                setLoading(false)
            }
            let current_servers = []
            function setServerData(){
                if (current_servers.length == querySnapshot.docs.length){
                setServers(current_servers)
                setLoading(false)
                console.log(servers)
                }
            }
            querySnapshot.forEach((doc) => {
                let current_server = doc.data()
                console.log(doc.data())
                current_server['id'] = doc.data().name
                current_servers.push(current_server)
                setServerData()
            })
        })
    }, [])
    return(
        <React.Fragment>
           <Typography variant="h4">
            Servers
          </Typography>
          <Paper sx={{height: 500, mt: 2}}>
          <DataGrid style={{border: 0}} pageSize={10}       rowsPerPageOptions={[10]}
 loading={loading} rows={servers}  columns={columns} components={{
          NoRowsOverlay: NoServers,
          Toolbar: Toolbar,
          LoadingOverlay: Loading
        }} />
        </Paper>
          </React.Fragment>
    )
}

export default AdminServersContainer