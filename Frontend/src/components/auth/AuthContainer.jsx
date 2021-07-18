import {
    Component
} from "react"
import axios from 'axios'
import {
    Link,
    Redirect
} from "react-router-dom"
import Loading from 'react-loading-bar'
import 'react-loading-bar/dist/index.css'
class AuthContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {email: '', password: ''}
        this.email = this.email.bind(this)
        this.password = this.password.bind(this)
        this.handleAuth = this.handleAuth.bind(this)
    }
    email(event){
        this.setState({email: event.target.value})
    }
    password(event){
        this.setState({password: event.target.value})
    }
    handleAuth(event){
        this.setState({ show: true })
        var user = {
            email: this.state.email,
            password: this.state.password
        }
        axios.post('https://authentication.hyehosting.com/authenticate', {user}).then(res => {
            if (res.data.status == "success"){
                function setCookie(name,value,days) {
                    var expires = "";
                    if (days) {
                        var date = new Date();
                        date.setTime(date.getTime() + (days*24*60*60*1000));
                        expires = "; expires=" + date.toUTCString();
                    }
                    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
                }
                setCookie('token', res.data.token, 1)
                this.setState({ show: false })
                window.location.href = "/";
            } else {
                this.setState({ show: false })
                alert('Invalid email/password')
            }
        })
        event.preventDefault();
    }
    render() {
        return(
            <>
                            <Loading
                    show={this.state.show}
                    color="red"
                    showSpinner={false}
                />
            <div className="container">
                <div class="p-5 d-flex justify-items-center">
                <img src="/images/logo.png" className="mx-auto" style={{marginTop: '10rem'}} width="128rem"></img>
                </div>
                <form onSubmit={this.handleAuth}>
                    <input value={this.state.email} onChange={this.email} type="email" id="inputEmail" name="email" class="form-control login" placeholder="Email Address" required autofocus />
                    <input value={this.state.password} onChange={this.password} type="password" id="inputPassword" name="password" class="form-control login" placeholder="Password" required></input>
                    <button class="btn btn-blue-lg d-block mx-auto mt-3" type="submit">Login</button>
                </form>
            </div>
            </>
        )
    }
}

export default AuthContainer