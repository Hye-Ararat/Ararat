import AdminDashboard from "../AdminDashboard"
import {
    Typography,
    Button
} from '@material-ui/core'
import {
    Link
} from 'react-router-dom'
function AdminServersContainer(){
    return(
    <AdminDashboard page="servers">
           <Typography fontWeight={500} variant="h4" component="h4">
            Servers
          </Typography>
          <Button component={Link} to="/admin/servers/create">Create Server</Button>
          </AdminDashboard>
    )
}

export default AdminServersContainer