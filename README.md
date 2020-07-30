# Play youtube alongside twitch

Originally made for IWD to make it easier to link to all necessary sources quickly.


# autosyncing feature instructions

1. Make sure you're logged in at [heroku](https://iwdsync.herokuapp.com/admin/)
    * the youtube link input won't show up if you are not logged in
1. go to [vercel app](https://iwdsync.vercel.app/caster/iwd/)
1. Set the youtube url by filling the input and clicking the button
1. play the video at any point
    * the video will automatically send timing data to server
    * **No need to click button anymore**
1. Now, viewers will be able to click *sync to caster* to try to sync their video.  They may have to mess with the offset timing.
    * I set it to 10 sec by default based on timing in your vods.


# Load Testing

* Requires 8 2x dynos on heroku to handle 1000 requests/second with 19ms response time
![loader.io load testing image](https://i.imgur.com/bcwWTif.png)


# ideas

- youtube muted by default
- twitch sound on by default
- autoplay youtube
- ensure video is synced with caster every \<x\> seconds
- reload player with new video if caster inputs a new video

