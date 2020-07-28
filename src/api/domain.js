let domain = 'https://iwdsync.herokuapp.com'
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    domain = 'http://localhost:8000'
}
else {
    domain = 'https://iwdsync.herokuapp.com'
}
export default domain
