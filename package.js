Package.describe({
  name: 'foobarbecue:lifestream',
  version: '0.1.0',
  // Brief, one-line summary of the package.
  summary: 'Collect and display streams of online activity from social APIs',
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
  
  api.use('jquery','client')
  api.use('d3js:d3@3.5.5','client');
  api.mainModule('lifestream.js');
});
