var congress_helper = require('../helpers/congress-helper');

/**
 * API controller for retrieving information about Congresses
 * @module api/controllers/congress
 * @requires api/helpers/CongressHelper
 */
var exports = {};

/**
 * GET members by congress, which congress indicated in req params
 */
exports.getCongressMembers = function(req, res, next) {
  congress_helper.getCongressMembers(req.params.congress)
  .then(function(results) {
    res.json({ members: results });
  }).catch(next);
};

module.exports = exports;
