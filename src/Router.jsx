import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
    useHistory
} from 'react-router-dom'
import Cookies from 'js-cookie'
import ServersContainer from './components/dashboard/ServersContainer'
import LoginContainer from './components/auth/LoginContainer'
import AccountContainer from './components/dashboard/AccountContainer'
import jsonwebtoken from 'jsonwebtoken'
import AdminOverviewContainer from './components/admin/overview/AdminOverviewContainer'
import AdminServersContainer from './components/admin/servers/AdminServersContainer'
import AdminCreateServerContainer from './components/admin/servers/AdminCreateServerContainer'
import AdminSettingsContainer from './components/admin/settings/AdminSettingsContainer'
import AdminNodesContainer from './components/nodes/AdminNodesContainer'
import CreateNode from './components/nodes/CreateNode'
import Gun from 'gun';
import SEA from 'gun/sea';
function AppRouter(){
    const gun = Gun(location.origin + "/gun");
    const user = gun.user()
    function isAuthenticated(){
        if (Cookies.get('token')){
            return(true)
        } else {
            return(false)
        }
    }
    function logout(){
        Cookies.remove('token')
        return(
            <Redirect to="/" />
        )
    }
    function isAdmin() {
        if (Cookies.get('token')){
            var user_info = jsonwebtoken.decode(Cookies.get('token'))
            return(user_info.admin)
        } else {
            return(false)
        }
        
    }
return(
    <Router>
        <Switch>
            <Route exact path="/" render={() => user.is ? <ServersContainer /> : <Redirect to="/auth/login" />} />
            <Route exact path="/account" render={() => isAuthenticated() ? <AccountContainer /> : <Redirect to="/auth/login" />} />
            <Route exact path="/auth/logout" >
                {() => logout()}
            </Route>
            <Route exact path = "/auth/login">
                <LoginContainer gun={gun}/>
            </Route>
            <Route exact path = "/admin" render={() => isAdmin() ? <AdminOverviewContainer /> : <Redirect to="/" />}>
            </Route>
            <Route exact path = "/admin/servers" render={() => isAdmin() ? <AdminServersContainer /> : <Redirect to="/" />} />
            <Route exact path = "/admin/servers/create" render={() => isAdmin() ? <AdminCreateServerContainer /> : <Redirect to="/" />} />
            <Route exact path = "/admin/settings" render={() => isAdmin() ? <AdminSettingsContainer /> : <Redirect to="/" />} />
            <Route exact path = "/admin/settings/mail" render={() => isAdmin() ? <AdminSettingsContainer /> : <Redirect to="/" />} />
            <Route exact path = "/admin/nodes" render={() => isAdmin() ? <AdminNodesContainer /> : <Redirect to="/" />} />
            <Route exact path = "/admin/nodes/create" render={() => isAdmin() ? <CreateNode /> : <Redirect to="/" />} />

        </Switch>
    </Router>
)
}

export default AppRouter;