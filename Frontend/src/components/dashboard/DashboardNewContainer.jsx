import ServerRow from "./ServerRow";
import Header from '../Header'
import Navigation from '../Navigation'
import getServers from "../../api/server/getServers";
import { useEffect, useState} from 'react'
import getServerResources from "../../api/server/resources/getServerResources";
import FadeIn from '../Fade'
import Loading from 'react-loading-bar'
import getAllocation from "../../api/allocations/getAllocation";
function DashboardNewContainer() {
    document.title = `Servers | Ararat`
    var [isLoading, setLoading] = useState(true)
    var [servers, setServers] = useState(() => {
        return(null)
    })


    useEffect(() => {
        setLoading(true)
        getServers(function(response){
            setServers(response)
            setLoading(false)
        })

    }, [])
    useEffect(() => {
        setInterval(function(){
            getServers(function(response){
                setServers(response)
            })
        }, 5000)
    }, [])
  
    return (
        <>
                                                <Loading
                    show={isLoading}
                    color="red"
                    showSpinner={false}
                />
            <div>
                <base href="../../../" />
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <meta name="description" content="The Best Server Control Panel In The Industry" />
                {/* Fav Icon  */}
                <link rel="shortcut icon" href="./images/favicon.png" />
                {/* Page Title  */}
                <title>Ararat | Dashboard</title>
                {/* StyleSheets  */}
                <link rel="stylesheet" href="./assets/css/dashlite.css?ver=2.6.0" />
                <link id="skin-default" rel="stylesheet" href="./assets/css/theme.css?ver=2.6.0" />
                <div className="nk-app-root">
                    {/* main @s */}
                    <div className="nk-main ">
                        {/* sidebar @s */}
                        <Navigation  page="servers"/>
                        {/* sidebar @e */}
                        {/* wrap @s */}
                        <div className="nk-wrap ">
                            {/* main header @s */}
                            <Header />
                            {/* main header @e */}
                            {/* content @s */}
                            <div className="nk-content ">
                                <div className="container-fluid">
                                    <div className="nk-content-inner">
                                        <div className="nk-content-body">
                                            <div className="components-preview wide-md mx-auto">
                                                <div className="nk-block-head nk-block-head-lg wide-sm">
                                                    <div className="nk-block-head-content">
                                                        <h2 className="nk-block-title fw-normal">Your Servers</h2>
                                                    </div>
                                                </div>{/* nk-block-head */}

                                                <div className="nk-block nk-block-lg">

                                                    <div className="card card-preview">
                                                        <table className="table table-orders">
                                                            <thead className="tb-odr-head">
                                                                <tr className="tb-odr-item">
                                                                    <th>
                                                                        <span>Name</span>
                                                                    </th>
                                                                    <th>
                                                                        <span>IP</span>
                                                                    </th>
                                                                    <th>
                                                                        <span>Memory</span>
                                                                    </th>
                                                                    <th>
                                                                        <span>CPU</span>
                                                                    </th>
                                                                    <th>
                                                                        <span>Storage</span>
                                                                    </th>
                                                                    <th>
                                                                        <span>Status</span>
                                                                    </th>
                                                                    <th>
                                                                        <span>Action</span>
                                                                    </th>

                                                                </tr>
                                                            </thead>
                                                            <tbody className="tb-odr-body">
                                                                {servers == null ? <p /> :
                                                                <>
                                                                {servers.map(server => (
                                                                    <ServerRow
                                                                     name={server.attributes.name}
                                                                     identifier={server.attributes.identifier}
                                                                     max_memory={server.attributes.limits.memory} 
                                                                     max_disk={server.attributes.limits.disk}
                                                                     suspended={server.attributes.suspended}
                                                                     allocation={server.attributes.allocation}
                                                                     status={server.attributes.status}
                                                                    //  status={server.resources.attributes.current_state}
                                                                    />
                                                                ))}   
                                                                </>                 
                                                                }


                                                            </tbody>
                                                        </table>
                                                    </div>{/* .card */}
                                                </div>{/* nk-block */}

                                            </div>{/* .components-preview */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* content @e */}
                            {/* footer @s */}
                            <div className="nk-footer">
                                <div className="container-fluid">
                                    <div className="nk-footer-wrap">
                                        <div className="nk-footer-copyright"> ©2021 Hye Hosting LLC. All Rights Reserved.
                                        </div>
                                        <div className="nk-footer-links">
                                            <ul className="nav nav-sm">
                                                <li className="nav-item"><a className="nav-link" href="https://hyehosting.com/tos">Terms of Service</a></li>
                                                <li className="nav-item"><a className="nav-link" href="https://hyehosting.com/privacy">Privacy Policy</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* footer @e */}
                        </div>
                        {/* wrap @e */}
                    </div>
                    {/* main @e */}
                </div>
                {/* app-root @e */}
                {/* JavaScript */}
            </div>
        </>
    )
}
export default DashboardNewContainer