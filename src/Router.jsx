import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom'

import DashboardContainer from './components/dashboard/DashboardContainer'
import LoginContainer from './components/auth/LoginContainer'

function AppRouter(){
return(
    <Router>
        <Switch>
            <Route exact path="/">
                <DashboardContainer />
            </Route>
            <Route exact path = "/auth/login">
                <LoginContainer />
            </Route>
        </Switch>
    </Router>
)
}

export default AppRouter;