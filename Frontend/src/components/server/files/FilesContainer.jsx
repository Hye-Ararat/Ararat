import {
    Component, useEffect, useState
} from "react"
import {
    useParams,
    withRouter,
    useHistory,
    useLocation,
    Link,
    Redirect
} from "react-router-dom"
import Cookies from "js-cookie"
import axios from "axios"
import FadeIn from '../../Fade'
import Loading from 'react-loading-bar'
import 'react-loading-bar/dist/index.css'
import ReactLoading from 'react-loading'
import getServer from "../../../api/server/getServer"
import getServerFiles from "../../../api/server/files/getServerFiles"
import FileRow from "./FileRow"

function FilesContainer() {
    const search = useLocation().search;
    const { uuid } = useParams();
    var history = useHistory();
    var [directory, setDirectory] = useState(() => {
        if (!window.location.hash == "") {
            return (window.location.hash)
        } else {
            history.push(
                {
                    hash: '/'
                }
            )
        }
    })
    var [isLoading, setLoading] = useState(() => {
        return (true)
    })
    var [server_name, setServerName] = useState(() => {
        return (null)
    })
    var [server_identifier, setServerIdentifier] = useState(() => {
        return(null)
    })
    var [server_files, setServerFiles] = useState(() => {
        return (null)
    })
    function changeDirectory(params) {
        setLoading(true)
        getServerFiles(uuid, params, function (files) {
            console.log(files)
            setServerFiles(files)
            setLoading(false)
        })
    }
    //Reload Files On Path Change
    useEffect(() => {
        history.listen((location, action) => {
            setLoading(true)
            setDirectory(window.location.hash)
            getServerFiles(uuid, window.location.hash, function (server_files) {

                console.log(server_files)
                setServerFiles(server_files)
                setLoading(false)
            })
        })
    }, [])
    //Server Data
    useEffect(() => {
        setLoading(true)
        getServer(uuid, function (server_data) {
            setServerName(server_data.attributes.name)
            setLoading(true)
                document.title = server_data.attributes.name + " | Files"
            setLoading(true)
        })
    }, [])

    //Server Files
    useEffect(() => {
        setLoading(true)
        getServerFiles(uuid, window.location.hash, function (server_files) {
            console.log(server_files)
            setServerFiles(server_files)
            setLoading(false)
        })

    }, [])

    //Refresh Data
    useEffect(() => {
        setInterval(function () {
            setLoading(true)
            //Server Data
            getServer(uuid, function (server_data) {
                setServerName(server_data.attributes.name)
                setLoading(true)
                if (server_name) {
                    document.title = server_name + " | Files"
                }
                setLoading(true)
            })
            //Server Files
            getServerFiles(uuid, window.location.hash, function (server_files) {

                console.log(server_files)
                setServerFiles(server_files)
                setLoading(false)
            })
        }, 10000)
    }, [])

    return (
        <div className="container">
            <Link to={`/server/${uuid}`}>Console</Link>
            <Loading
                show={isLoading}
                color="red"
                showSpinner={false}
            />
                            <FadeIn>
                    <h1 className="mt-3 mb-3">File Management</h1>
                </FadeIn>
{/*             {server_name ?
                <FadeIn>
                    <h1 className="mt-3 mb-3">{server_name}</h1>
                </FadeIn>
                :
                ""} */}
            {server_files ?
                <FadeIn>
                    {server_files.map(file => (
                                         <Link onClick={() => changeDirectory(file.attributes.name)} to={file.attributes.is_file == false ? `${window.location.hash}${file.attributes.name}/` : `/server/${uuid}/files/edit${window.location.hash}${file.attributes.name}`} key={Math.random().toString(36).substring(2)}>           <FileRow file_name={file.attributes.name}></FileRow></Link>
                        
                        
             
                    ))}
                </FadeIn> : <div className="d-flex justify-content-evenly">
                    <ReactLoading color="#EC635D" type='spin' />
                </div>
            }

        </div>
    )
}
export default withRouter(FilesContainer)