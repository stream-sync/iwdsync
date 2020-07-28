import axios from 'axios'
import domain from './domain'

axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'


function get(params) {
    const url = `${domain}/api/caster/`
    return axios.get(url, {params})
}

function getMyCaster() {
    const url = `${domain}/api/caster/get-my-caster`
    return axios.get(url, {withCredentials: true})
}

function update(data) {
    const url = `${domain}/api/caster/`
    return axios.put(url, {...data, withCredentials: true})
}

export default {
    get,
    getMyCaster,
    update,
}
