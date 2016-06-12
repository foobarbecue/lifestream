Package.describe({
  name: 'foobarbecue:lifestream-server',
  version: '0.1.7',
  // Brief, one-line summary of the package.
  summary: 'Collect and publish streams of online activity from social APIs',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/foobarbecue/lifestream',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.4');
  api.use('ecmascript');
  api.use('http');
  api.use('percolate:synced-cron@1.1.1');
  api.use('jcbernack:reactive-aggregate@0.5.0');
  api.use('jquery');
  api.use('meteor-base');
  api.mainModule('server/main.js','server');
});
