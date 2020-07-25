import React, { useState } from 'react'

export function CreateConfig(props) {
    const [title, setTitle] = useState('')
    const [youtube_url, setYoutubeUrl] = useState('')
    const [twitch_channel, setTwitchChannel] = useState('')

    const input_style = {
        marginBottom: 8,
    }

    return (
        <div style={{ margin: 'auto' }}>
            <div style={{ margin: 'auto' }}>
                <h3>Create a Config</h3>
                <div>title</div>
                <input
                    style={{...input_style}}
                    type="text" value={title} onChange={event => setTitle(event.target.value)} />

                <div>youtube url</div>
                <input
                    style={{...input_style}}
                    type="text"
                    value={youtube_url}
                    onChange={event => setYoutubeUrl(event.target.value)}
                />

                <div>twitch channel id (the part after twitch.tv/)</div>
                <input
                    style={{...input_style}}
                    type="text"
                    value={twitch_channel}
                    onChange={event => setTwitchChannel(event.target.value)}
                />

                <div style={{ marginTop: 20 }}>
                    <div>
                        <ul>
                            <li>
                                Copy the text in the box below
                                <br />
                                <div
                                    style={{
                                        display: 'inline-block',
                                        border: '1px solid grey',
                                        borderRadius: 5,
                                        minWidth: 500,
                                        padding: 10,
                                    }}
                                >
                                    <div>title={title}</div>
                                    <div>youtube_live_url={youtube_url}</div>
                                    <div>twitch_channel={twitch_channel}</div>
                                </div>
                            </li>
                            <li>
                                Save the text in{' '}
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://hastebin.com"
                                >
                                    hastebin.com
                                </a>
                            </li>
                            <li>Save the url and bring it back</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
