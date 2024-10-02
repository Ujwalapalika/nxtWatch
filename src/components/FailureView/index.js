const FailureView = ({onRetry}) => {
  return (
    <div className="failure-view-container">
      <h1 className="failure-title">Oops! Something went wrong.</h1>
      <p className="failure-message">
        We are unable to fetch the videos at this time. Please try again.
      </p>
      <button className="retry-button" type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

export default FailureView
