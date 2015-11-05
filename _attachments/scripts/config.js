// adapted from http://ozkatz.github.io/converting-an-existing-backbonejs-project-to-requirejs.html
// also: https://github.com/jrburke/requirejs/wiki/Patterns-for-separating-config-from-the-main-module
require.config({
  'baseUrl': 'scripts',
  'deps': ["main"],
  'paths': {
    'jquery': '../vendor/jquery/dist/jquery',
    'underscore': '../vendor/underscore/underscore',
    'backbone': '../vendor/backbone/backbone',
    'd3': '../vendor/d3/d3'
  },
  'shim': {
    'underscore': {
      'exports': '_'
    },
    'backbone': {
      'deps': ['jquery', 'underscore'],
      'exports': 'Backbone'
    }
  }
});
