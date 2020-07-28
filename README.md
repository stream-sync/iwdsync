# Play youtube alongside twitch

Originally made for IWD to make it easier to link to all necessary sources quickly.


# autosyncing feature instructions

1. Make sure you're logged in at [heroku](https://iwdsync.herokuapp.com/admin/)
    * the youtube link input won't show up if you are not logged in
1. go to [vercel app](https://iwdsync.vercel.app/caster/iwd/)
1. Set the youtube url by filling the input and clicking the button
1. play the video at any point
    * click **sync for viewers**
1. Now, viewers will be able to click *sync to caster*
to try to sync their video.  They may have to mess with the offset timing.


# ideas

- easier way to set youtube url
- youtube muted by default
- twitch sound on by default
- sync youtube with IWD using carbo's method
    - switch to using the controlled player api's
    - save timestamps to hardstuck OR use some online key/value store
    - save youtube video to hardstuck?
