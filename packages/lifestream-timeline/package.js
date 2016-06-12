Package.describe({
  name: 'foobarbecue:lifestream-timeline',
  version: '0.0.3',
  // Brief, one-line summary of the package.
  summary: 'A blaze timeline widget designed for use with foobarbecue:lifestream-server',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/foobarbecue/lifestream',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.4');
  api.use('ecmascript');
  api.use('foobarbecue:lifestream-server');
  api.use('jcbernack:reactive-aggregate');
  api.use('mongo');
  api.use('templating');
  api.use('d3js:d3@3.5.5','client');
  api.mainModule('main.js','client');
});