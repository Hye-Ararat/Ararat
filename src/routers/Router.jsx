import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom"

import AuthContainer from '../components/auth/AuthContainer'
import DashboardContainer from "../components/dashboard/DashboardContainer";
import FilesContainer from '../components/server/files/FilesContainer'
import ServerContainer from "../components/server/ServerContainer"
import FileEditorContainer from "../components/server/files/FileEditorConatiner";
import NotFound from '../components/NotFound'
import Cookies from 'js-cookie';
import SideBar from '../components/Sidebar'
import Testing from '../components/dashboard/Testing'
import ServerNewContainer from "../components/server/ServerNewContainer";
function AppRouter() {

  function checkAuth() {

    var token = Cookies.get('token')
    return token;
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {checkAuth() ? <DashboardContainer /> : <Redirect to="/login" />}
        </Route>
        <Route exact path = "/server/:uuid">
          {checkAuth() ? <ServerContainer /> : <Redirect to="/login" />}
        </Route>
        <Route exact path = "/new/server/:uuid">
          {checkAuth() ? <ServerNewContainer /> : <Redirect to="/login" />}
        </Route>
        <Route exact path = "/server/:uuid/files">
          {checkAuth() ? <FilesContainer /> : <Redirect to="/login" />}
        </Route>
        <Route exact path = "/server/:uuid/files/edit">
          {checkAuth() ? <FileEditorContainer /> : <Redirect to="/login" />}
        </Route>

        <Route exact path="/login" exact component={() => <AuthContainer />} />
        <Route exact path="/testing" exact component={() => <Testing />} />
        <Route exact path="/sidebar" exact component={() => <SideBar />} />


        <Route path="*" component={NotFound} />

      </Switch>
    </Router>
  );
}

export default AppRouter;