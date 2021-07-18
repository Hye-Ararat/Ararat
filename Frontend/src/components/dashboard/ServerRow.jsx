import {
    Component
} from "react"
import { useEffect, useState } from 'react'
import {
    Link
} from "react-router-dom"
import prettyBytes from 'pretty-bytes'
import FadeIn from '../Fade'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import ReactLoading from 'react-loading'
import getServerResources from "../../api/server/resources/getServerResources";
import Loading from 'react-loading-bar'
import getAllocation from "../../api/allocations/getAllocation"

function ServerRow(props) {
    const [stats, setStats] = useState(() => {
        return (null)
    })
    const [status, setStatus] = useState(() => {
        return (null)
    })
    var [allocation, setAllocation] = useState(() => {
        return(null)
    })
    useEffect(() => {
        if (props.suspended == false) {
            if (props.status == "installing"){
                setStatus(<FadeIn><span className="badge badge-dot badge-info">Installing</span></FadeIn>)
            }
            if (props.status == "restoring_backup"){
                setStatus(<FadeIn><span className="badge badge-dot badge-info">Restoring Backup</span></FadeIn>)
            }
            getServerResources(props.identifier, props.uuid).then((e) => {
                if (e.attributes.current_state == 'running') setStatus(<FadeIn><span className="badge badge-dot badge-success">Online</span></FadeIn>)
                if (e.attributes.current_state == 'transferring') setStatus(<FadeIn><span className="badge badge-dot badge-info">Transferring</span></FadeIn>)
                if (e.attributes.current_state == 'offline') setStatus(<FadeIn><span className="badge badge-dot badge-danger">Offline</span></FadeIn>)
                if (e.attributes.current_state == 'starting') setStatus(<FadeIn><span className="badge badge-dot badge-warning">Starting</span></FadeIn>)
                if (e.attributes.current_state == 'stopping') setStatus(<FadeIn><span className="badge badge-dot badge-warning">Stopping</span></FadeIn>)
                if (e.attributes.current_state == 'restarting') setStatus(<FadeIn><span className="badge badge-dot badge-primary">Restarting</span></FadeIn>)
                if (e.attributes.is_suspended == true) setStatus(<FadeIn><span className="badge badge-dot badge-warning">Suspended</span></FadeIn>)
                setStats(e)
            })
        } else {
            setStatus(<FadeIn><span className="badge badge-dot badge-warning">Suspended</span></FadeIn>)
            setStats({
                object: "stats",
                attributes: {
                    current_state: "suspended",
                    is_suspended: true,
                    resources: {
                        cpu_absolute: 0,
                        disk_bytes: 0,
                        memory_bytes: 0,
                        network_rx_bytes: 0,
                        network_tx_bytes: 0

                    }
                }
            })
        }
        setInterval(function(){
            console.log('running')
            if (props.suspended == false) {                    
                getServerResources(props.identifier, props.uuid).then((e) => {
                    if (e.attributes.current_state == 'running') setStatus(<FadeIn><span className="badge badge-dot badge-success">Online</span></FadeIn>)
                    if (e.attributes.current_state == 'transferring') setStatus(<FadeIn><span className="badge badge-dot badge-info">Transferring</span></FadeIn>)
                    if (e.attributes.current_state == 'offline') setStatus(<FadeIn><span className="badge badge-dot badge-danger">Offline</span></FadeIn>)
                    if (e.attributes.current_state == 'starting') setStatus(<FadeIn><span className="badge badge-dot badge-warning">Starting</span></FadeIn>)
                    if (e.attributes.current_state == 'stopping') setStatus(<FadeIn><span className="badge badge-dot badge-warning">Stopping</span></FadeIn>)
                    if (e.attributes.current_state == 'restarting') setStatus(<FadeIn><span className="badge badge-dot badge-primary">Restarting</span></FadeIn>)
                    if (e.attributes.is_suspended == true) setStatus(<FadeIn><span className="badge badge-dot badge-warning">Suspended</span></FadeIn>)
                    setStats(e)
                })
            } else {
                setStatus(<FadeIn><span className="badge badge-dot badge-warning">Suspended</span></FadeIn>)
                setStats({
                    object: "stats",
                    attributes: {
                        current_state: "suspended",
                        is_suspended: true,
                        resources: {
                            cpu_absolute: 0,
                            disk_bytes: 0,
                            memory_bytes: 0,
                            network_rx_bytes: 0,
                            network_tx_bytes: 0
    
                        }
                    }
                })
            }
        }, 5000)
    }, [])
    useEffect(() => {
        getAllocation(props.allocation, function(response){
            console.log(`EEEEEE + ${JSON.stringify(response)}`)
            setAllocation(response[0])
        })
    }, [])


    return (
        <>
            {console.log(stats)}
            <tr className="tb-odr-item">
                <td>
                    <span><Link to={`/server/${props.identifier}`}>{props.name}</Link></span>
                </td>
                <td>
                {allocation ? 
                <FadeIn>
                <span>{allocation.ip_alias}</span>
                {allocation.port == 1025 ? "" : ":" + allocation.port}
                </FadeIn> : 
                
                ""}

                </td>
                <td>
                    <span>
                        {stats ? <FadeIn>{stats.attributes.resources.memory_bytes > props.max_memory * 1048576 ? 
                        <>
                        {prettyBytes(props.max_memory * 1048576, { binary: 'true' })}/{prettyBytes(props.max_memory * 1048576, { binary: 'true' })}
                        </>
                        : 
                        <>
                        {prettyBytes(stats.attributes.resources.memory_bytes, { binary: 'true' })} / {prettyBytes(props.max_memory * 1048576, { binary: 'true' })}
                        </>
                        }                      </FadeIn> 
                        : prettyBytes(props.max_memory * 1048576, { binary: 'true' })}
                    </span>

                </td>
                <td>
                    <span>
                        {stats ? <FadeIn>{stats.attributes.resources.cpu_absolute}%</FadeIn> : ""}
                    </span>

                </td>
                <td>
                    <span>
                        {stats ? <FadeIn>{prettyBytes(stats.attributes.resources.disk_bytes, { binary: 'true' })} / {prettyBytes(props.max_disk * 1048576, { binary: 'true' })}</FadeIn> : prettyBytes(props.max_disk * 1048576, { binary: 'true' })}
                    </span>

                </td>
                <td>
                    <span>
                        {status}

                    </span>
                </td>
                <td>
                    <span>
                        <Link className="btn btn-sm btn-primary" to={`/new/server/${props.identifier}`}>Manage</Link>
                    </span>
                </td>


            </tr>
        </>
    )

}
export default ServerRow;