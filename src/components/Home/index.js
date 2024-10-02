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

class Home extends Component {
  state = {
    activeStatus: apiStatus.initial,
    videosList: [],
    search: '',
    searchInput: '',
  }

  componentDidMount() {
    this.fetchVideos()
  }

  fetchVideos = async () => {
    const {search} = this.state
    this.setState({activeStatus: apiStatus.inProgress})
    const url = `https://apis.ccbp.in/videos/all?search=${search}`
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
        channel: {
          name: each.channel.name,
          profileImageUrl: each.channel.profile_image_url,
        },
        viewCount: each.view_count,
        publishedAt: each.published_at,
      }))
      this.setState({
        activeStatus: apiStatus.success,
        videosList: fetchedData,
      })
    } else {
      this.setState({activeStatus: apiStatus.failure})
    }
  }

  retryFetchVideos = () => {
    this.fetchVideos()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchButton = () => {
    const {searchInput} = this.state
    this.setState({search: searchInput}, this.fetchVideos)
  }

  renderSearchInput = () => (
    <div className="search-container">
      <input
        type="search"
        className="search-input"
        placeholder="Search"
        onChange={this.onChangeSearchInput}
      />
      <button
        type="button"
        className="search-button"
        onClick={this.onClickSearchButton}
        data-testid="searchButton"
      >
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch/search-icon.png"
          alt="search icon"
          className="search-icon"
        />
      </button>
    </div>
  )

  renderVideos = () => {
    const {videosList} = this.state
    if (videosList.length === 0) {
      return <p className="no-videos">No Videos Found</p>
    }
    return (
      <ul className="videos-list">
        {videosList.map(video => (
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

  renderFailureView = () => <FailureView onRetry={this.retryFetchVideos} />

  render() {
    const {activeStatus} = this.state

    return (
      <div className="home-container">
        {this.renderSearchInput()}
        {activeStatus === apiStatus.inProgress && this.renderLoader()}
        {activeStatus === apiStatus.success && this.renderVideos()}
        {activeStatus === apiStatus.failure && this.renderFailureView()}
      </div>
    )
  }
}

export default Home
