import React, { useEffect, useState } from 'react'
import { caster_data } from '../../configs/gen'
import { TwitchEmbed } from './twitchembed'
import { TwitchChatEmbed } from './twitchchatembed'
import { YoutubeEmbed } from './youtubeembed'

export function Caster(props) {
    const [ext_config, setExtConfig] = useState({})
    const caster = props.match.params.caster
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
        if (caster) {
            let url = `https://cors-anywhere.herokuapp.com/${config.config_url}`
            fetch(url, options).then(response => {
                response.text().then(text => {
                    parseData(text)
                })
            })
        }
    }, [caster, config])
    return (
        <div>
            <h1 style={{textAlign: 'center'}}>{caster}</h1>
            <div style={{ height: 100 }}></div>
            {ext_config && (
                <>
                    <div style={{display: 'flex', margin: 'auto', flexWrap: 'wrap'}}>

                        <div style={{margin: 'auto'}}>
                            <TwitchChatEmbed config={ext_config} />
                        </div>

                        <div style={{margin: 'auto'}}>
                            <TwitchEmbed config={ext_config} />
                        </div>

                        <div style={{margin: 'auto'}}>
                            <YoutubeEmbed config={ext_config} />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
