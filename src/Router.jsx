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
import {getAuth} from 'firebase/auth'
console.log(document.app)

function AppRouter(){
    const auth = getAuth(Firebase)
    function isAuthenticated(){
        const user = auth().currentUser
        console.log(user)
        if (user != null){
            console.log('hello' + user.displayName)
            return(true)
        } else {
            console.log(user)
            return(false)
        }
    }
    function logout(){
        return(
            <Redirect to="/" />
        )
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
            <Route exact path="/" render={() => isAuthenticated() ? <ServersContainer /> : <Redirect to="/auth/login" />}></Route>
            <Route exact path="/account" render={() => isAuthenticated() ? <AccountContainer /> : <Redirect to="/auth/login" />} />
            <Route exact path="/auth/logout" >
                {() => logout()}
            </Route>
            <Route exact path = "/auth/login" render={() => isAuthenticated() ? <Redirect to="/" /> : <LoginContainer />}>
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