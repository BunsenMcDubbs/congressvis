var db = require('../db-connector');
var member_helper = require('../helpers/member-helper');

/**
 * GET all members
 */
function getMembers(req, res, next) {
  db.getConnection()
  .then(function(connection) {
    return member_helper.getMemberByID(null, connection);
  })
  .then(function(results) {
    res.json({ members: results });
  }).catch(next);
}

/**
 * GET member by id helper
 * @private
 * @param {?(object | string | string[])} id - id(s) (should only be 1 in
 * this case) of members to get
 */
function getMemberHelper(id, res, next) {
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
function getMemberByBioguideId(req, res, next) {
  getMemberHelper({ bioguide_id: req.params.bioguide_id }, res, next);
}

/**
 * GET member by thomas id, provided in the request parameters
 */
function getMemberByThomasId(req, res, next) {
  getMemberHelper({ thomas_id: req.params.thomas_id }, res, next);
}

/**
 * GET member by govtrack id, provided in the request parameters
 */
function getMemberByGovtrackId(req, res, next) {
  getMemberHelper({ govtrack_id: req.params.govtrack_id }, res, next);
}

/**
 * GET member by lis id, provided in the request parameters
 */
function getMemberByLisId(req, res, next) {
  getMemberHelper({ lis_id: req.params.lis_id }, res, next);
}

/**
 * GET member by name, provided in the request parameters
 * optional: `exact=true` in the url query if seeking an exact
 *    first, last or full name match
 * optional: `exact_full=true` in the url query if seeking an exact
 *    full name match (this will take precedence over `exact`)
 */
function getMemberByName(req, res, next) {
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
}

module.exports = {
  getMembers: getMembers,
  getMemberById: getMemberByBioguideId,
  getMemberByBioguideId: getMemberByBioguideId,
  getMemberByThomasId: getMemberByThomasId,
  getMemberByGovtrackId: getMemberByGovtrackId,
  getMemberByLisId: getMemberByLisId,
  getMemberByName: getMemberByName
};
