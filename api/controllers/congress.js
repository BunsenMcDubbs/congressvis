var congress_helper = require('../helpers/congress-helper');

/**
 * API controller for retrieving information about Congresses
 * @module api/controllers/congress
 * @requires api/helpers/CongressHelper
 */
var exports = {};

exports.getCongresses = function(req, res, next) {
  congress_helper.getCongress()
  .then(function(results) { res.json(results); })
  .catch(next);
};

exports.getCongressById = function(req, res, next) {
  var congress = req.params.congress;
  congress_helper.getCongress(congress)
  .then(function(results) {
    res.json(results[0]);
  })
  .catch(function(err) {
    if (Array.isArray(err) && err.length === 0) {
      err = new Error('Cannot find congress #' + req.params.congress);
      err.status = 404;
    }
    next(err);
  });
};

/**
 * GET members by congress, which congress indicated in req params
 */
exports.getCongressMembers = function(req, res, next) {
  var congress = req.params.congress;
  congress_helper.getCongressMembers(congress)
  .then(function(results) {
    res.json(results);
  }).catch(function(err) {
    if (Array.isArray(err) && err.length === 0) {
      err = new Error('Cannot find congress #' + req.params.congress);
      err.status = 404;
    }
    next(err);
  });
};

module.exports = exports;
