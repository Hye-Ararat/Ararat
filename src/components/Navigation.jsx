import React from 'react'
import { Link} from 'react-router-dom'
class Navigation extends React.Component {
    render(){
        return(
            <>
         <div className="nk-sidebar nk-sidebar-fixed is-light " data-content="sidebarMenu">
              <div className="nk-sidebar-element nk-sidebar-head">
                <div className="nk-sidebar-brand">
                  <a href="html/index.html" className="logo-link nk-sidebar-logo">
                    <img className="logo-light logo-img" src="/images/logo.png" srcSet="./images/logo.png 2x" alt="logo" />
                    <img className="logo-dark logo-img" src="/images/logo.png" srcSet="./images/logo.png 2x" alt="logo-dark" />
                    <img className="logo-small logo-img logo-img-small" src="/images/logo.png" srcSet="/images/logo.png 2x" alt="logo-small" />
                  </a>
                </div>
                <div className="nk-menu-trigger mr-n2">
                  <a href="#" className="nk-nav-toggle nk-quick-nav-icon d-xl-none" data-target="sidebarMenu"><em className="icon ni ni-arrow-left" /></a>
                  <a href="#" className="nk-nav-compact nk-quick-nav-icon d-none d-xl-inline-flex" data-target="sidebarMenu"><em className="icon ni ni-menu" /></a>
                </div>
              </div>{/* .nk-sidebar-element */}
              <div className="nk-sidebar-element">
                <div className="nk-sidebar-content">
                  <div className="nk-sidebar-menu" data-simplebar>
                    <ul className="nk-menu">
                      <li className={this.props.page == "servers" ? "nk-menu-item active current-page" : "nk-menu-item" }>
                        <Link to="/" className="nk-menu-link">
                          <span className="nk-menu-icon"><em className="icon ni ni-server-fill" /></span>
                          <span className="nk-menu-text">Servers</span>
                        </Link>
                      </li>{/* .nk-menu-item */}
                      <li className="nk-menu-item">
                        <Link to="/billing" className="nk-menu-link">
                          <span className="nk-menu-icon"><em className="icon ni ni-cart-fill" /></span>
                          <span className="nk-menu-text">Billing</span>
                        </Link>
                      </li>{/* .nk-menu-item */}
                      <li className="nk-menu-item">
                        <Link to="/billing" className="nk-menu-link">
                          <span className="nk-menu-icon"><em className="icon ni ni-ticket-alt-fill" /></span>
                          <span className="nk-menu-text">Support</span>
                        </Link>
                      </li>{/* .nk-menu-item */}
                      <li class="nk-menu-heading">
                                    <h6 class="overline-title text-primary-alt">User Settings</h6>
                                </li>
                                <li className="nk-menu-item">
                        <Link to="/account" className="nk-menu-link">
                          <span className="nk-menu-icon"><em className="icon ni ni-user-circle-fill" /></span>
                          <span className="nk-menu-text">Account</span>
                        </Link>
                      </li>{/* .nk-menu-item */}                                <li className="nk-menu-item">
                        <Link to="/account" className="nk-menu-link">
                          <span className="nk-menu-icon"><em className="icon ni ni-arrow-left-fill-c" /></span>
                          <span className="nk-menu-text">Logout</span>
                        </Link>
                      </li>
                    </ul>{/* .nk-menu */}
                  </div>{/* .nk-sidebar-menu */}
                </div>{/* .nk-sidebar-content */}
              </div>{/* .nk-sidebar-element */}
            </div>
            </>
        )
    }
}
export default Navigation