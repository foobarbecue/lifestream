# Setup

Add a file `appdir/private/lifestream_config.json` where appdir is the directory of the app in which you will use lifestream.

Fill out that file similar to the the example in `examples/lifestream_config.json`. You may need to get api keys for some of the services.

Run `meteor add foobarbecue` in your app directory.

# Inspired by jquery-lifestream
When I first wanted to display my online activity, I used [excellent jquery plugin](https://github.com/christianvuerings/jquery-lifestream) by christianvuerings. Eventually I realized it wasn't what I needed. jquery-lifestream queries APIs from the client and loads them directly into the browser. For most of the services it used the Yahoo Query Language system. For some of the other services it [used weird personal web apps, some of which are defunct.](https://github.com/christianvuerings/jquery-lifestream/pull/206)

In the end I realized my philosophy on how to do this was different from jquery-lifestream and so I decided to start from scratch using meteor. foobarbecue:lifestream uses a cron job to periodically download data directly from social APIs (no YQL or random Heroku apps) to a mongo collection. It also includes a d3-based zoomable timeline display for the feed.