var db = require('../db-connector');
var member_helper = require('../helpers/member-helper');

/**
 * API controller for retrieving members
 * @module api/controllers/members
 * @requires api/DBConnector
 * @requires api/helpers/MemberHelper
 */
var exports = {};

/**
 * GET all members
 */
exports.getMembers = function(req, res, next) {
  db.getConnection()
  .then(function(connection) {
    return member_helper.getMemberByID(connection, null);
  })
  .then(function(results) {
    res.json({ members: results });
  }).catch(next);
};

/**
 * GET member by id helper
 * @private
 * @param {?(object | string | string[])} id - id(s) (should only be 1 in
 * this case) of members to get
 */
function getMemberByIdHelper(id, res, next) {
  db.getConnection()
  .then(function(connection) {
    return member_helper.getMemberByID(connection, id);
  })
  .then(function(results) {
    if (!results || results.length === 0) {
      var err = new Error('No member found with id: ' + JSON.stringify(id));
      err.status = 404;
      throw err;
    }
    res.json(results[0]);
  }).catch(next);
}

/**
 * GET member by bioguide id, provided in the request parameters
 */
exports.getMemberByBioguideId = function(req, res, next) {
  getMemberByIdHelper({ bioguide_id: req.params.bioguide_id }, res, next);
};

exports.getMemberById = exports.getMemberByBioguideId;

/**
 * GET member by thomas id, provided in the request parameters
 */
exports.getMemberByThomasId = function(req, res, next) {
  getMemberByIdHelper({ thomas_id: req.params.thomas_id }, res, next);
};

/**
 * GET member by govtrack id, provided in the request parameters
 */
exports.getMemberByGovtrackId = function(req, res, next) {
  getMemberByIdHelper({ govtrack_id: req.params.govtrack_id }, res, next);
};

/**
 * GET member by lis id, provided in the request parameters
 */
exports.getMemberByLisId = function(req, res, next) {
  getMemberByIdHelper({ lis_id: req.params.lis_id }, res, next);
};

/**
 * GET member by name, provided in the request parameters
 * optional: `exact=true` in the url query if seeking an exact
 *    first, last or full name match
 * optional: `exact_full=true` in the url query if seeking an exact
 *    full name match (this will take precedence over `exact`)
 */
exports.getMemberByName = function(req, res, next) {
  var name = req.params.name;
  if (!name) {
    var err = new Error('Must provide a name in ByName lookup');
    err.status = 400;
    next(err);
  }
  // mode 2 if `exact_full`, mode 1 if `exact`, else mode 0
  var mode = req.query.exact_full ? 2 : (req.query.exact ? 1 : 0);
  db.getConnection()
  .then(function(connection) {
    return member_helper.getMemberByName(connection, name, mode);
  })
  .then(function(results) {
    if (mode !== 0 && (!results || results.length === 0)) {
      var err = new Error('Could not find an exact name match for "' + name + '"');
      err.status = 404;
      throw err;
    }
    res.json(results);
  }).catch(next);
};

module.exports = exports;
