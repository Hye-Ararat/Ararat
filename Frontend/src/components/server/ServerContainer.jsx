import {
    Component
} from "react"
import {
    useParams,
    withRouter,
    Link
} from 'react-router-dom'
import axios from "axios"
import Cookies from "js-cookie"
import jwt from "jsonwebtoken"
import Loading from 'react-loading-bar'
import 'react-loading-bar/dist/index.css'
import ReactLoading from 'react-loading'
import FadeIn from '../Fade'
import Navbar from '../Nav'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { AttachAddon } from 'xterm-addon-attach'
import SideBar from '../Sidebar'

class ServerContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            server_name: null,
            email: null,
            first_name: null,
            last_name: null,
            user_id: null,
            loadingUserData: true,
            loadingServerData: true,
            loadingConsoleData: true,
            input: '',
            sock: {},
            server_type: null
        }

    }
    handleInputChanged(event) {
        this.setState({
            input: event.target.value
        });
    }
    do(event) {
        event.preventDefault()
        var e = this.state.input
        var term = this.state.sock
        term.send(e)
        console.log(e)
        this.setState({ input: '' })
    }
    handleEnter() {
        var e = this.state.input
        var term = this.state.sock
        term.send(e)
        console.log(e)
    }
    async componentDidMount() {
        this.setState({ show: true })
        var data = jwt.decode(Cookies.get('token'))
        this.setState({
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            user_id: data.id,
            loadingUserData: false
        })
        var server_type = (await axios.get(`https://ararat-backend.hyehosting.com/server/${this.props.match.params.uuid}/type?token=${Cookies.get('token')}`)).data
        var server_data = await axios.get(`https://ararat-backend.hyehosting.com/server/${this.props.match.params.uuid}?token=${Cookies.get('token')}`)
        this.setState({
            server_name: server_data.data.attributes.name,
            loadingServerData: false,
            server_type: server_type
        })
        document.title = `${server_data.data.attributes.name} | Console`

        if (server_type == "Minecraft") {
            try {
                const terminal = new Terminal({
                    disableStdin: true,
                    theme: {
                        background: '#1e1e1e'
                    }
                })
               
                const fitAddon = new FitAddon()
                terminal.loadAddon(fitAddon)
                this.setState({ loadingConsoleData: false })
                const terminalContainer = document.getElementById('console');
                terminal.open(terminalContainer)
                var consoleSocket = new WebSocket(`wss://ararat-backend.hyehosting.com/server/minecraft/console?server=${server_data.data.attributes.identifier}`);
                this.setState({ sock: consoleSocket })
                console.log(consoleSocket)
                fitAddon.fit()
                window.onresize = () => {
                    fitAddon.fit()
                }
                consoleSocket.onmessage = (e) => {
                    if (e.data == 'ERR_JWT_NOT_VALID') {
                        document.location.reload()
                    }
                    terminal.writeln(e.data)
                }
                this.setState({ show: false })
                this.sub = function () {
                    var name = this.state.input;
                    consoleSocket.send(name)
                }
                this.handleChange = function (event) {
                    this.setState({
                        input: event.target.value
                    });
                } 
            } catch (error) {
                console.log(error)
            }
            
        }
        if (server_type == "N-VPS") {
            try {
                const terminal = new Terminal({})
                const fitAddon = new FitAddon()
                const attachAddon = new AttachAddon(new WebSocket('wss://ararat-backend.hyehosting.com/server/n-vps/console?server=' + server_data.data.attributes.uuid.replace(/[0-9]/g, '').replace(/[^a-zA-Z ]/g, "")))
                terminal.loadAddon(fitAddon)
                terminal.loadAddon(attachAddon)
                this.setState({ loadingConsoleData: false })
                const terminalContainer = document.getElementById('console');
                terminal.open(terminalContainer)
                fitAddon.fit()
                window.onresize = () => {
                    var checkTerminalContainer = document.getElementById('console')
                    if (checkTerminalContainer) {
                        fitAddon.fit()
                    } else {
                        console.log('HA HA GOTEEE')
                    }
                }
                this.setState({ show: false })
            } catch (error) {
              console.log(error)
            }
           
        }

    }
    render() {
        return (
            <>
            <div class="mr-3">
                <div className="sticky-top" style={{
                    float: 'left',
                    marginRight: '2%',
                    marginLeft: '0px',
                    height: '100%',
                    width: '280px',
                    position: 'relative'
                }}>
                    <SideBar />
                </div>
                </div>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/xterm/3.14.5/xterm.min.css"
                    integrity="sha512-iLYuqv+v/P4u9erpk+KM83Ioe/l7SEmr7wB6g+Kg1qmEit8EShDKnKtLHlv2QXUp7GGJhmqDI+1PhJYLTsfb8w=="
                    crossorigin="anonymous" referrerpolicy="no-referrer" />
                <Navbar />
                <div className="container" style={{ position: 'auto', color: 'red'}}>
                    <Loading
                        show={this.state.show}
                        color="red"
                        showSpinner={false}
                    />
                    <Link to={`/server/${this.props.match.params.uuid}/files#/`}>File Manager</Link>

                    {this.state.loadingServerData ?
                        "" :
                        <>
                            <FadeIn>
                                <h1 className="mt-3 mb-3">{this.state.server_name}</h1>
                            </FadeIn>
                        </>
                    }
                    {this.state.loadingConsoleData ?
                        "" :
                        <>
                            <FadeIn>
                                <div>
                                    <div id="console" style={{
                                        height: '40rem'
                                    }}></div>
                                    {this.state.server_type == "Minecraft" ?
                                        <>
                                            <form onSubmit={this.do.bind(this)}>
                                                <input style={{ width: '100%' }} type="text" className="form-control" placeholder="Type a command..." value={this.state.input} onChange={this.handleInputChanged.bind(this)} />
                                            </form>
                                        </>
                                        :
                                        ""
                                    }


                                </div>
                            </FadeIn>
                        </>
                    }
                </div>
            </>
        )
    }
}
export default withRouter(ServerContainer)