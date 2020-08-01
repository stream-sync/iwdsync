import React from 'react'


export function Instructions(props) {
    return (
        <div>
            <h3>How do I use this</h3>
            <ul>
                <li>
                    Use the toggles at the top to change the layout of the
                    page.
                </li>
                <li>
                    You can show/hide twitch chat, move the mini player, 
                    separate out the twitch stream.
                </li>
            </ul>

            <h3>How to sync video</h3>
            <ul>
                <li>
                    Change the <b>offset</b> value below the youtube stream
                    until the <b>game timer</b> matches with the timer in the twitch
                    stream.
                </li>
                <li>
                    Your offset value will save for the next time you use the same browser,
                    but if the twitch delay changes you may have re-set it.
                </li>
                <li>
                    You can click on the offset input field and use your up and down
                    arrow keys to nudge the time by 0.1 seconds.
                </li>
            </ul>

            <h3>Sync isn't working?</h3>
            <ul>
                <li>
                    If your video is not syncing and you are watching a live youtube stream,
                    you may need to first play the youtube stream at 2x speed to ensure
                    you are ahead of the caster.
                </li>
                <li>
                    If it still isn't working, click the lock in the address bar and try
                    deleting the site cookies and retrying.
                </li>
            </ul>

            <h3>Idk Brian, your shit website still is not working.</h3>
            <ul>
                <li>
                    sorry - just sync it manually for now
                </li>
            </ul>
        </div>
    )
}
