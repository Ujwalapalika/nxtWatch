import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import ReactPlayer from 'react-player'
import Loader from 'react-loader-spinner'
import FailureView from '../FailureView'
import './index.css'

const apiStatus = {
  initial: 'initial',
  inProgress: 'inProgress',
  success: 'success',
  failure: 'failure',
}

class VideoItem extends Component {
  state = {
    videoData: null,
    activeStatus: apiStatus.initial,
    isLiked: false,
    isDisliked: false,
    isSaved: false,
  }

  componentDidMount() {
    this.fetchVideoDetails()
  }

  fetchVideoDetails = async () => {
    this.setState({activeStatus: apiStatus.inProgress})
    const {match} = this.props
    const {params} = match
    const {videoId} = params
    const videoItemDetailsApiUrl = `https://apis.ccbp.in/videos/${videoId}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(videoItemDetailsApiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedVideoData = {
        id: data.video_details.id,
        title: data.video_details.title,
        videoUrl: data.video_details.video_url,
        thumbnailUrl: data.video_details.thumbnail_url,
        channel: {
          name: data.video_details.channel.name,
          profileImageUrl: data.video_details.channel.profile_image_url,
          subscriberCount: data.video_details.channel.subscriber_count,
        },
        viewCount: data.video_details.view_count,
        publishedAt: data.video_details.published_at,
        description: data.video_details.description,
      }
      this.setState({
        videoData: updatedVideoData,
        activeStatus: apiStatus.success,
      })
    } else {
      this.setState({activeStatus: apiStatus.failure})
    }
  }

  retryFetchVideoDetails = () => {
    this.fetchVideoDetails()
  }

  toggleLike = () => {
    this.setState(prevState => ({
      isLiked: !prevState.isLiked,
      isDisliked: false, // Disable dislike if like is active
    }))
  }

  toggleDislike = () => {
    this.setState(prevState => ({
      isDisliked: !prevState.isDisliked,
      isLiked: false, // Disable like if dislike is active
    }))
  }

  toggleSave = () => {
    this.setState(prevState => ({
      isSaved: !prevState.isSaved,
    }))
  }

  renderVideoPlayer = () => {
    const {videoData, isLiked, isDisliked, isSaved} = this.state
    const {
      title,
      videoUrl,
      channel,
      viewCount,
      publishedAt,
      description,
    } = videoData
    const likeBtnClassName = isLiked ? 'active-button' : ''
    const dislikeBtnClassName = isDisliked ? 'active-button' : ''
    const saveBtnClassName = isSaved ? 'active-button' : ''
    const saveText = isSaved ? 'Saved' : 'Save'

    return (
      <div className="video-details-container">
        <ReactPlayer url={videoUrl} width="100%" controls />
        <h1 className="video-title">{title}</h1>
        <div className="video-info">
          <p>{viewCount} views</p>
          <p>{publishedAt}</p>
        </div>
        <div className="video-actions">
          <button
            type="button"
            className={`action-button ${likeBtnClassName}`}
            onClick={this.toggleLike}
          >
            Like
          </button>
          <button
            type="button"
            className={`action-button ${dislikeBtnClassName}`}
            onClick={this.toggleDislike}
          >
            Dislike
          </button>
          <button
            type="button"
            className={`action-button ${saveBtnClassName}`}
            onClick={this.toggleSave}
          >
            {saveText}
          </button>
        </div>
        <hr />
        <div className="channel-info">
          <img src={channel.profileImageUrl} alt="channel logo" />
          <div>
            <p>{channel.name}</p>
            <p>{channel.subscriberCount} subscribers</p>
          </div>
        </div>
        <p className="video-description">{description}</p>
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <FailureView onRetry={this.retryFetchVideoDetails} />
  )

  render() {
    const {activeStatus} = this.state

    switch (activeStatus) {
      case apiStatus.inProgress:
        return this.renderLoader()
      case apiStatus.success:
        return this.renderVideoPlayer()
      case apiStatus.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }
}

export default withRouter(VideoItem)
