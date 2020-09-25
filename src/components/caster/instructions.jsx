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
                    Trying to implement auto-sync.  It's a bit finicky and I haven't
                    tested it much, so it may not work properly right now.  If that's the case
                    you'll just have to sync up manually by moving around in the youtube stream.
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

            {/* <h3>How can I contribute?</h3> */}
            {/* <ul> */}
            {/*     <li> */}
            {/*         The for the site is now public on{' '} */}
            {/*         <a target='_blank' rel="noopener noreferrer" href="https://github.com/stream-sync">github</a>. */}
            {/*         If you are comfortable with frontend development with React */}
            {/*         feel free to fork the code. Also make issues for bugs and changes */}
            {/*         you'd like to see. */}
            {/*     </li> */}
            {/* </ul> */}
        </div>
    )
}
