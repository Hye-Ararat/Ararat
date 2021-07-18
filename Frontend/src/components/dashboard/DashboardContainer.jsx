import {
    Component,
    useRef
} from "react"
import axios from 'axios'
import {
    Link,
    Redirect
} from "react-router-dom"
import jwt from "jsonwebtoken"
import Cookies from 'js-cookie';
import ReactLoading from 'react-loading'
import ServerRow from './ServerRow'
import prettyBytes from 'pretty-bytes'
import Loading from 'react-loading-bar'
import 'react-loading-bar/dist/index.css'
import FadeIn from '../Fade'
import getServerResources from '../../api/server/resources/getServerResources'
import SideBar from '../Sidebar'
class DashboardContainer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loadingUserData: true,
            loadingServerData: true,
            email: null,
            first_name: null,
            last_name: null,
            user_id: null,
            servers: null,
            server_resources: null
        }
    }
    async componentDidMount() {
        document.title = 'Dashboard'
        this.setState({ show: true })
        var data = jwt.decode(Cookies.get('token'))
        this.setState({
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            user_id: data.id,
            loadingUserData: false
        })
        var servers = await axios.get(`https://ararat-backend.hyehosting.com/servers?token=${Cookies.get('token')}`)
        console.log(servers.data.data)
        if (servers.data.data) {
            var server_list = servers.data.data
        } else {
            var server_list = servers.data
        }
        console.log(server_list)
        this.setState({
            servers: server_list,
            loadingServerData: false
        })
        if (server_list.length == 0) {

        } else {
                var server_resource_data = []
                for (var server_item of server_list) {
                    var server_resources = await axios.get(`https://ararat-backend.hyehosting.com/servers/${server_item.attributes.identifier}/resources?token=${Cookies.get('token')}`)
                    server_resource_data.push({
                        data: server_resources.data,
                        uuid: server_item.attributes.identifier
                    })
                    this.setState({ show: true })

                }
                this.setState({
                    server_resources: server_resource_data
                })

        }
        this.setState({ show: false })

    }
    render() {
        return (
            <>

            <div className="sticky-top" style={{
                float: 'left',
                marginRight: '2%',
                marginLeft: '0px',
                height: '100%',
            }}>
<SideBar /> 
</div>
                <Loading
                    show={this.state.show}
                    color="red"
                    showSpinner={false}
                />
                <div class="container" >
                
                    <FadeIn>
                        <h1 style={{ fontWeight: 'bold' }}>Your Servers</h1>
                    </FadeIn>
                    {this.state.loadingServerData ?
                        <div className="d-flex justify-content-evenly">
                            <ReactLoading color="#EC635D" type='spin' />
                        </div>
                        :
                        <>
                            {this.state.servers.length == 0 ?
                                <div>
                                    <h3 className="text-center mt-5">Looks Like You Don't Have Any Servers!</h3>
                                    <div className="col mt-3 text-center">
                                        <Link className="mx-auto" to="/order"><button className="btn btn-blue-lg">Order Now</button></Link>
                                    </div>
                                </div> :
                                <div className="row">
                                    {this.state.servers.map(server => (
                                        <ServerRow
                                            key={server.attributes.id}
                                            name={server.attributes.name}
                                            description={server.attributes.description}
                                            current_memory={this.state.server_resources instanceof Array ?
                                                prettyBytes(this.state.server_resources.filter(resources => resources.uuid == server.attributes.identifier)[0].data.attributes.resources.memory_bytes, { binary: true })
                                                :
                                                <ReactLoading color="#EC635D" type='spin' height={20} width={20} />}
                                            memory={prettyBytes(server.attributes.limits.memory * 1048576, { binary: true })}
                                            current_disk={this.state.server_resources instanceof Array ?
                                                prettyBytes(this.state.server_resources.filter(resources => resources.uuid == server.attributes.identifier)[0].data.attributes.resources.disk_bytes, { binary: true })
                                                :
                                                <ReactLoading color="#EC635D" type='spin' height={20} width={20} />}
                                            current_state={this.state.server_resources instanceof Array ?
                                                this.state.server_resources.filter(resources => resources.uuid == server.attributes.identifier)[0].data.attributes.current_state
                                                :
                                                "loading"}
                                            disk={prettyBytes(server.attributes.limits.disk * 1048576, { binary: true })}
                                            id={server.attributes.identifier} />
                                    ))}
                                </div>
                            }
                        </>
                    }
                </div>
            </>
        )
    }
}

export default DashboardContainer