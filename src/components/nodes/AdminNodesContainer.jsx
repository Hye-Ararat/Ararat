import AdminDashboard from "../admin/AdminDashboard";
import React from 'react'
import {
    Typography,
    Button
} from '@material-ui/core'
import {DataGrid, GridOverlay} from '@material-ui/data-grid'
import {
    withRouter,
    Link
} from 'react-router-dom'
import axios from 'axios'
function NoNodes(){
    return(
        <GridOverlay>
            <p>No nodes were found</p>
        </GridOverlay>
    )
}
function AdminNodesContainer(){
    const [nodes, setNodes] = React.useState([])
    const [columns, setColumns] = React.useState([{field: 'name', headerName: 'Name', width: 130}, {field: "group", headerName: 'Group', width: 125}, {field: "resources.memory", headerName: "Memory", width: 130}])
    React.useEffect(() => {
        axios.get('http://api.hye.gg:3000/api/v1/admin/nodes').then(function(response){
            console.log(response.data)
            let node_data = response.data
            node_data['id'] = node_data['_id']
            console.log(node_data)
            setNodes(node_data)
        }).catch(function(error){
            console.log(error)
        })
    }, [])
    return(
        <AdminDashboard page="nodes">
            <Typography fontWeight={500} variant="h4" component="h4">
                Nodes
            </Typography>
            <Button component={Link} to="/admin/nodes/create">Create Node</Button> 
            <DataGrid loading={nodes[0] ? false : true} rows={nodes}  columns={columns} components={{
          NoRowsOverlay: NoNodes,
        }} />
            </AdminDashboard>
    )
}
export default withRouter(AdminNodesContainer)