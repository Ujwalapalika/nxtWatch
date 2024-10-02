import {Link} from 'react-router-dom'
import {Component} from 'react'
import ThemeAndVideoContext from '../../Context/ThemeAndVideoContext'

class Header extends Component {
  render() {
    return (
      <ThemeAndVideoContext.Consumer>
        {value => {
          const {isDarkTheme, toggleTheme} = value
          const themeClass = isDarkTheme ? 'dark-header' : 'light-header'
          const logoUrl = isDarkTheme
            ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-dark-theme-img.png'
            : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png'

          return (
            <div className={`header-container ${themeClass}`}>
              <Link to="/">
                <img
                  src={logoUrl}
                  alt="website logo"
                  className="website-logo"
                />
              </Link>
              <button
                type="button"
                className="theme-button"
                onClick={toggleTheme}
                data-testid="theme"
              >
                {isDarkTheme ? (
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/light-theme-img.png"
                    alt="theme"
                    className="theme-icon"
                  />
                ) : (
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/dark-theme-img.png"
                    alt="theme"
                    className="theme-icon"
                  />
                )}
              </button>
            </div>
          )
        }}
      </ThemeAndVideoContext.Consumer>
    )
  }
}

export default Header
