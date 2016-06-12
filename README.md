# A modular system for collecting and displaying web activity streams

At the moment this repository contains two packages:
 - [foobarbecue:lifestream-server](http://github.com/foobarbecue/lifestream/tree/master/packages/lifestream-server/README.md), which scoops up public social streams from services like Youtube, Github, and Stackexchange.
 - [foobarbecue:lifestream-timeline](http://github.com/foobarbecue/lifestream/tree/master/packages/lifestream-timeline/README.md), which displays data from the lifestream server on a zoomable timeline in the browser.

Instructions for each are in README.md in each package root directory.

# Inspired by jquery-lifestream
When I first wanted to display my online activity, I used [excellent jquery plugin](https://github.com/christianvuerings/jquery-lifestream) by christianvuerings. jquery-lifestream queries APIs from the client and loads them directly into the browser. For most of the services it used the Yahoo Query Language system. For some of the other services it [used weird personal web apps, some of which are defunct.](https://github.com/christianvuerings/jquery-lifestream/pull/206)

In the end I realized my philosophy on how to do this was different from jquery-lifestream and so I decided to start from scratch using meteor. foobarbecue:lifestream uses a cron job to periodically download data directly from social APIs (no YQL or random Heroku apps) to a mongo collection. It also includes a d3-based zoomable timeline display for the feed.