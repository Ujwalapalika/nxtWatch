import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    userName: '',
    password: '',
    errorMsg: '',
    showPassword: false,
    showError: false,
  }

  userNameField = event => {
    this.setState({userName: event.target.value})
  }

  passwordField = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = error => {
    this.setState({
      errorMsg: error,
      showError: true,
    })
  }

  submitLogin = async event => {
    event.preventDefault()
    const {userName, password} = this.state
    const userDetails = {userName, password}
    const url = 'https://apis.ccbp.in/login'
    const Option = {
      Method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, Option)
    const data = response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {userName, password, errorMsg, showPassword, showError} = this.state
    const inputType = showPassword ? 'text' : 'password'
    return (
      <div className="App_container">
        <form className="form_container" onSubmit={this.submitLogin}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
            alt="website logo"
            className="Logo"
          />
          <label htmlFor="username">USERNAME</label>
          <input
            type="text"
            value={userName}
            onChange={this.userNameField}
            id="username"
            name="username"
            placeholder="UserName"
          />
          <label htmlFor="password">PASSWORD</label>
          <input
            type={inputType}
            value={password}
            placeholder="Password"
            id="password"
            onChange={this.passwordField}
            name="password"
          />
          <div className="checkbox_container">
            <checkbox
              type="checkbox"
              id="checkbox"
              onChange={this.showPasswordFn}
            />
            <label htmlFor="checkbox">Show Password</label>
            />
          </div>
          <button type="submit">Login</button>
          {showError && <p>{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default Login
