import axios from 'axios'
import domain from './domain'

axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.withCredentials = true

const BASE = `${domain}/api/caster`

function get(params) {
    const url = `${BASE}/`
    return axios.get(url, {params})
}

function getMyCaster() {
    const url = `${BASE}/get-my-caster/`
    return axios.get(url)
}

function update(data) {
    data.action = 'update'
    const url = `${BASE}/`
    return axios.post(url, data)
}

export default {
    get,
    getMyCaster,
    update,
}
