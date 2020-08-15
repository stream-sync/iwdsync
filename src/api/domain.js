export default process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : process.env.REACT_APP_DOMAIN || 'https://iwdsync.herokuapp.com'
