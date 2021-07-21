import {
    useState,
    useEffect
} from 'react'
import FadeIn from './Fade'
import getGeoNode from '../api/getGeoNode'
function Footer(){
    var [node, setNode] = useState(() => {
        return(null)
    })
    useEffect(() => {
        getGeoNode(function(node){
            setNode(node)
        })
    }, [])
    return(
        <div className="nk-footer">
        <div className="container-fluid">
            <div className="nk-footer-wrap">
                <div className="nk-footer-copyright row"> ©2021 Hye Hosting LLC. All Rights Reserved. {node ? <FadeIn className="ml-1">{"Connected Via " + node + "." }</FadeIn>: ""}
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
    )

}
export default Footer