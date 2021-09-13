import AdminDashboard from "../AdminDashboard"
import {
    Typography,
    Button
} from '@material-ui/core'
import {DataGrid, GridOverlay} from '@material-ui/data-grid'

import {
    Link,
    useParams
} from 'react-router-dom'
import {getFirestore, query, onSnapshot, collection} from '@firebase/firestore'
import React from "react"
function NoNodes(){
    return(
        <GridOverlay>
            <p>No nodes were found</p>
        </GridOverlay>
    )
}

const database = getFirestore()
function AdminServersContainer(){
    const {instance} = useParams()
    const [servers, setServers] = React.useState([])
    const [columns, setColumns] = React.useState([{field: 'name', headerName: 'Name', width: 130}, {field: "limits.memory", headerName: "Memory", width: 130}])
    React.useEffect(() => {
        const q = query(collection(database, `/instances/${instance}/servers`))
        onSnapshot(q, (querySnapshot) => {
            let current_servers = []
            function setServerData(){
                setServers(current_servers)
                console.log(servers)
            }
            querySnapshot.forEach((doc) => {
                var current_server = doc.data()
                console.log(doc.data())
                current_server['id'] = doc.data().name
                current_servers.push(current_server)
                setServerData()
            })
        })
    }, [])
    return(
        <React.Fragment>
           <Typography fontWeight={500} variant="h4" component="h4">
            Servers
          </Typography>
          <Button component={Link} to={`/admin/instance/${instance}/servers/create`}>Create Server</Button>
          <DataGrid pageSize={10}         rowsPerPageOptions={[10]}
 loading={servers[0] ? false : true} rows={servers}  columns={columns} components={{
          NoRowsOverlay: NoNodes,
        }} />
          </React.Fragment>
    )
}

export default AdminServersContainer