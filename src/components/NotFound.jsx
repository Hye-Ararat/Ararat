import {
    Component
} from 'react'
import {
    Link
} from 'react-router-dom'
class NotFound extends Component {
    render() {
        return(
<div>
  <base href="../../../" />
  <meta charSet="utf-8" />
  {/* Fav Icon  */}
  <link rel="shortcut icon" href="./images/favicon.png" />
  {/* Page Title  */}
  <title>Error 404 | Ararat</title>
  {/* StyleSheets  */}
  <link rel="stylesheet" href="./assets/css/dashlite.css?ver=2.6.0" />
  <link id="skin-default" rel="stylesheet" href="./assets/css/theme.css?ver=2.6.0" />
  <div className="nk-app-root">
    {/* main @s */}
    <div className="nk-main ">
      {/* wrap @s */}
      <div className="nk-wrap nk-wrap-nosidebar">
        {/* content @s */}
        <div className="nk-content ">
          <div className="nk-block nk-block-middle wide-md mx-auto">
            <div className="nk-block-content nk-error-ld text-center">
              <img className="nk-error-gfx" src="./images/gfx/error-404.svg" alt="" />
              <div className="wide-xs mx-auto">
                <h3 className="nk-error-title">Oops!</h3>
                <p className="nk-error-text">It looks like you’re trying to access a page that no longer exists, or never existed.</p>
                <Link to="/" className="btn btn-lg btn-primary mt-2">Back To Dashboard</Link>
              </div>
            </div>
          </div>{/* .nk-block */}
        </div>
        {/* wrap @e */}
      </div>
      {/* content @e */}
    </div>
    {/* main @e */}
  </div>
  {/* app-root @e */}
  {/* JavaScript */}
</div>


        )
    }
}
export default NotFound