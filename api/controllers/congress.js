var db = require('../utils/db-connector');
var congress_helper = require('../helpers/congress-helper');

/**
 * API controller for retrieving information about Congresses
 * @module api/controllers/congress
 * @requires api/utils/DBConnector
 * @requires api/helpers/CongressHelper
 */
var exports = {};

/**
 * GET members by congress, which congress indicated in req params
 */
exports.getCongressMembers = function(req, res, next) {
  db.getConnection()
  .then(function(connection) {
    return congress_helper.getCongressMembers(connection, req.params.congress);
  })
  .then(function(results) {
    res.json({ members: results });
  }).catch(next);
};

module.exports = exports;
