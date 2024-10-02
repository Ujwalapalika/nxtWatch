import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import videoCard from '../videoCard'
import FailureView from '../FailureView'
import './index.css'

const apiStatus = {
  initial: 'initial',
  inProgress: 'inProgress',
  success: 'success',
  failure: 'failure',
}

class Gaming extends Component {
  state = {
    activeStatus: apiStatus.initial,
    gamingVideosList: [],
  }

  componentDidMount() {
    this.fetchGamingVideos()
  }

  fetchGamingVideos = async () => {
    this.setState({activeStatus: apiStatus.inProgress})
    const url = 'https://apis.ccbp.in/videos/gaming'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const fetchedData = data.videos.map(each => ({
        id: each.id,
        title: each.title,
        thumbnailUrl: each.thumbnail_url,
        viewCount: each.view_count,
      }))
      this.setState({
        activeStatus: apiStatus.success,
        gamingVideosList: fetchedData,
      })
    } else {
      this.setState({activeStatus: apiStatus.failure})
    }
  }

  renderGamingVideos = () => {
    const {gamingVideosList} = this.state
    return (
      <ul className="videos-list">
        {gamingVideosList.map(video => (
          <videoCard key={video.id} video={video} />
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => <FailureView onRetry={this.fetchGamingVideos} />

  render() {
    const {activeStatus} = this.state

    return (
      <div className="gaming-container">
        {activeStatus === apiStatus.inProgress && this.renderLoader()}
        {activeStatus === apiStatus.success && this.renderGamingVideos()}
        {activeStatus === apiStatus.failure && this.renderFailureView()}
      </div>
    )
  }
}

export default Gaming
