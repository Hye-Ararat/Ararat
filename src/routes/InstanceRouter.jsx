import { Switch, Route } from "react-router-dom"
import AccountContainerInstances from "../components/instances/AccountContainerInstances"
import InstanceNavigation from '../components/instances/Navigation'
import InstancesContainer from '../components/instances/InstancesContainer'

function InstanceRouter(){
    return(
            <Route path="/">
                <InstanceNavigation>
                <Route exact path="/" component={InstancesContainer} />
                <Route exact path="/account" component={AccountContainerInstances} />
                </InstanceNavigation>
            </Route>
    )
}

export default InstanceRouter