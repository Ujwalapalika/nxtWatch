import {Component} from 'react'
import ThemeAndVideoContext from '../../Context/ThemeAndVideoContext'
import videoCard from '../videoCard'

class SavedVideos extends Component {
  renderNoSavedVideos = () => (
    <div className="no-videos">
      <h1>No Saved Videos Found</h1>
    </div>
  )

  renderSavedVideos = savedVideos => (
    <ul className="saved-videos-list">
      {savedVideos.map(video => (
        <videoCard key={video.id} video={video} />
      ))}
    </ul>
  )

  render() {
    return (
      <ThemeAndVideoContext.Consumer>
        {value => {
          const {savedVideos} = value
          const isEmpty = savedVideos.length === 0
          return (
            <div className="saved-videos-container">
              {isEmpty
                ? this.renderNoSavedVideos()
                : this.renderSavedVideos(savedVideos)}
            </div>
          )
        }}
      </ThemeAndVideoContext.Consumer>
    )
  }
}

export default SavedVideos
