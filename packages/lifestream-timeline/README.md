This package is part of [Lifestream](https://github.com/foobarbecue/lifestream).

# Setup

If you want a server for the timeline to load data from, follow the instructions for [the instructions for lifestream-server](http://github.com/foobarbecue/lifestream/tree/master/packages/lifestream-server/README.md). You can ignore the part where it tells you to run `meteor add foobarbecue:lifestream-server`, because it will be added as a dependancy when you add lifestream-timeline.

Run `meteor add foobarbecue:lifestream-timeline` in your app directory.

Add `{{> lifestream}}` to a blaze template where you would like the timeline to be displayed.
