import axios from 'axios'

// axios.defaults.xsrfHeaderName = 'x-csrftoken'
// axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.withCredentials = true

const BASE = `${process.env.REACT_APP_API_BASE}/api/caster`

function get(params) {
    const url = `${BASE}/`
    return axios.get(url, { params })
}

function getMyCaster() {
    const url = `${BASE}/get-my-caster/`
    return axios.get(url)
}

function update(data, csrf) {
    data.action = 'update'
    data.csrfmiddlewaretoken = csrf
    // let csrf = Cookies.get('csrftoken')
    const headers = {
        'X-CSRFToken': csrf,
        'access-control-allow-credentials': 'true',
    }
    const url = `${BASE}/`
    return axios.post(url, data, { headers })
}

function getCsrf() {
    const url = `${BASE}/get-csrf/`
    return axios.get(url)
}

export default {
    get,
    getMyCaster,
    update,
    getCsrf,
}
