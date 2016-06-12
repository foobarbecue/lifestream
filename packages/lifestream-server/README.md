This package is part of [Lifestream](https://github.com/foobarbecue/lifestream).

# Setup

Add a file `myapp/settings.json` where myapp is the directory of the app in which you will use lifestream.

Fill out that file similar to the the example at `http://github.com/foobarbecue/lifestream/example_app/settings.json`. You may need to get api keys for some of the services.

If you want a timeline displayed in the browser, follow [the instructions for lifestream-timeline](`http://github.com/foobarbecue/lifestream/tree/master/packages/lifestream-timeline/README.md).

Run `meteor add foobarbecue:lifestream-server` in your app directory (this is not necessary if you've already added a package which depends on lifestream-server, such as lifestream-timeline).

Specify the settings file when you start your app -- like `meteor run --settings settings.json`.