import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import videoCard from '../videoCard'
import FailureView from '../FailureView'

const apiStatus = {
  initial: 'initial',
  inProgress: 'inProgress',
  success: 'success',
  failure: 'failure',
}

class Trending extends Component {
  state = {
    activeStatus: apiStatus.initial,
    trendingVideosList: [],
  }

  componentDidMount() {
    this.fetchTrendingVideos()
  }

  fetchTrendingVideos = async () => {
    this.setState({activeStatus: apiStatus.inProgress})
    const url = 'https://apis.ccbp.in/videos/trending'
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
        trendingVideosList: fetchedData,
      })
    } else {
      this.setState({activeStatus: apiStatus.failure})
    }
  }

  renderTrendingVideos = () => {
    const {trendingVideosList} = this.state
    return (
      <ul className="videos-list">
        {trendingVideosList.map(video => (
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

  renderFailureView = () => <FailureView onRetry={this.fetchTrendingVideos} />

  render() {
    const {activeStatus} = this.state

    return (
      <div className="trending-container">
        {activeStatus === apiStatus.inProgress && this.renderLoader()}
        {activeStatus === apiStatus.success && this.renderTrendingVideos()}
        {activeStatus === apiStatus.failure && this.renderFailureView()}
      </div>
    )
  }
}

export default Trending
