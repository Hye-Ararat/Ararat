import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
    useHistory
} from 'react-router-dom'
import React from 'react'
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
import Firebase from './components/db'
import {getAuth, signOut} from 'firebase/auth'
import {Backdrop, CircularProgress} from '@material-ui/core'
import AuthLoading from './components/auth/AuthLoading'
import InstancesContainer from './components/instances/InstancesContainer'
function AppRouter(){
    const [logged_in, setLoggedIn] = React.useState('loading')
    const auth = getAuth(Firebase)
    auth.onAuthStateChanged(function(user){
        if (user){
            console.log(user)
            console.log("logged in")
            setLoggedIn(true)
        } else {
            console.log('logged out')
            setLoggedIn(false)
        }
    })
    function isAuthenticated(){
        return(logged_in)
    }
    function logout(){
        auth.signOut(auth).then(() => {
            console.log('logged out!')
            setLoggedIn(false)
            
        }).catch((error) => {
            console.log('error '+ error)
        })

    }
    function isAdmin() {
        // if (Cookies.get('token')){
        //     var user_info = jsonwebtoken.decode(Cookies.get('token'))
        //     return(user_info.admin)
        // } else {
        //     return(false)
        // }
        return true
    }
return(
    <Router>
        <Switch>
            <Route exact path="/" >{logged_in == "loading" ? <AuthLoading />: logged_in == true ? <InstancesContainer /> : <Redirect to="/auth/login" />}</Route>
            <Route exact path="/account">{logged_in == "loading" ? <AuthLoading /> : logged_in == true ? <AccountContainer /> : <Redirect to="/auth/login" />}</Route>
            <Route exact path="/:instance">{logged_in == "loading" ? <AuthLoading />: logged_in == true ? <ServersContainer /> : <Redirect to="/auth/login" />}</Route>
            <Route exact path="/auth/logout" >
                {logged_in == "loading" ? <AuthLoading /> : logged_in == true ? () => logout() : <Redirect to="/auth/login" />}
            </Route>
            <Route exact path = "/auth/login"> {logged_in == "loading" ? <AuthLoading /> : logged_in == true ? <Redirect to="/" /> : <LoginContainer />}
            </Route>
            <Route exact path = "/:instance/admin" render={() => isAdmin() ? <AdminOverviewContainer /> : <Redirect to="/" />}>
            </Route>
            <Route exact path = "/:instance/admin/servers" render={() => isAdmin() ? <AdminServersContainer /> : <Redirect to="/" />} />
            <Route exact path = "/:instance/admin/servers/create" render={() => isAdmin() ? <AdminCreateServerContainer /> : <Redirect to="/" />} />
            <Route exact path = "/:instance/admin/settings" render={() => isAdmin() ? <AdminSettingsContainer /> : <Redirect to="/" />} />
            <Route exact path = "/:instance/admin/settings/mail" render={() => isAdmin() ? <AdminSettingsContainer /> : <Redirect to="/" />} />
            <Route exact path = "/:instance/admin/nodes" render={() => isAdmin() ? <AdminNodesContainer /> : <Redirect to="/" />} />
            <Route exact path = "/:instance/admin/nodes/create" render={() => isAdmin() ? <CreateNode /> : <Redirect to="/" />} />

        </Switch>
    </Router>
)
}

export default AppRouter;