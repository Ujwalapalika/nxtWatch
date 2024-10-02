import {Link} from 'react-router-dom'
import './index.css'

const videoCard = props => {
  const {video} = props
  const {id, title, thumbnailUrl, channel, viewCount, publishedAt} = video
  const {name, profileImageUrl} = channel
  return (
    <li className="video-card">
      <Link to={`/videos/${id}`}>
        <img src={thumbnailUrl} alt="thumb nail" className="thumbnail" />
        <div className="video-info">
          <img
            src={profileImageUrl}
            alt="channel logo"
            className="channel-logo"
          />
          <div className="video-details">
            <p className="video-title">{title}</p>
            <p className="channel-name">{name}</p>
            <div className="video-stats">
              <p className="view-count">{viewCount} views</p>
              <p className="published-date">{publishedAt}</p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  )
}
export default videoCard
