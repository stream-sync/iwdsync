import React, { useEffect, useState } from 'react'
import { caster_data } from '../../configs/gen'
import { TwitchEmbed } from './twitchembed'
import { TwitchChatEmbed } from './twitchchatembed'
import { YoutubeEmbed } from './youtubeembed'
import queryString from 'query-string'

export function Caster(props) {
    const [ext_config, setExtConfig] = useState({})
    let caster = props.match.params.caster
    const config = caster_data[caster]

    const parseData = text => {
        let dat = {}
        for (let line of text.split('\n')) {
            let [key, val] = [line.split('=')[0], line.split('=').slice(1).join('=')]
            key = key.trim()
            val = val.trim()
            dat[key] = val
        }
        setExtConfig(dat)
    }

    useEffect(() => {
        const options = {
            headers: { 'Access-Control-Allow-Origin': '*' },
            origin: null,
        }
        let qs = queryString.parse(window.location.search)
        let url = undefined
        if (caster) {
            url = `https://cors-anywhere.herokuapp.com/${config.config_url}`
        } else if (qs.config) {
            if (qs.config.indexOf('/raw/') === -1) {
                let haste_id = qs.config.split('hastebin.com/')[1].split('.')[0]
                console.log(haste_id)
                url = `https://cors-anywhere.herokuapp.com/https://hastebin.com/raw/${haste_id}`

            }
            else {
                url = `https://cors-anywhere.herokuapp.com/${qs.config}`
            }
        }
        if (url) {
            fetch(url, options).then(response => {
                response.text().then(text => {
                    parseData(text)
                })
            })
        }
    }, [caster, config])
    return (
        <div>
            {ext_config && (
                <>
                    <h1 style={{ textAlign: 'center' }}>{ext_config.title}</h1>
                    <div style={{ height: 100 }}></div>
                    <div style={{ display: 'flex', margin: 'auto', flexWrap: 'wrap' }}>
                        <div style={{ margin: 'auto' }}>
                            <TwitchChatEmbed config={ext_config} />
                        </div>

                        <div style={{ margin: 'auto' }}>
                            <TwitchEmbed config={ext_config} />
                        </div>

                        <div style={{ margin: 'auto' }}>
                            <YoutubeEmbed config={ext_config} />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
