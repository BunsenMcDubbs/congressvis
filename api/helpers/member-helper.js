var mysql = require('mysql');
var Q = require('q');
var _ = require('underscore');

var schema = require('../swagger/member.json');
var transform = require('../utils/transformer');

var db = require('../utils/db-connector');

/**
 * Helper class for converting and retrieving members to/from the database
 * @constructor
 * @requires api/utils/db-connector
 */
function MemberHelper() {}

/**
 * Retrieve member(s) based on id
 * @param {?(string | string[] | Object)} id - one or more ids
 *
 *  - `(string | string[])` bioguide id(s), array will retrieve multiple
 *
 *  - `object` if specifying id other than bioguide.
 *    If multiple id's are present, all will be retrieved.
 *    ex) `{'thomas_id': (string | string[])}`
 *
 *    supports:
 *      - bioguide_id
 *      - thomas_id
 *      - govtrack_id
 *      - lis_id (only available for senators)
 *
 *  - `null` will retrieve all
 * @returns { Promise } a promise that will resolve with a list of members
 */
MemberHelper.prototype.getMemberByID = function(id) {
  var id_types = ['bioguide_id', 'thomas_id', 'govtrack_id', 'lis_id'];
  // build query
  var query = 'SELECT * FROM members';
  if (!id) {
    id = null;
  } else {
    if (id.constructor === Array || typeof id === 'string') {
      if (typeof id === 'string') {
        id = [id];
      }
      id = { bioguide_id : id };
    }
    query += ' WHERE ';
    var given_id_types = Object.keys(id);
    for (var i = 0; i < given_id_types.length; i++) {
      var id_type = given_id_types[i];
      if (id_types.indexOf(id_type) !== -1) {
        query += id_type + ' IN (' + db.escape(id[id_type]) + ')';
      }
      if (i < given_id_types.length - 1) { query += ' OR '; }
    }
  }

  // query database for members
  var deferred = Q.defer();
  db.pool.query(query, function(err, rows) {
    if (err) { deferred.reject(err); }
    else { deferred.resolve(transformMembers(rows)); }
  });
  return deferred.promise;
};

/**
 * Retrieve member(s) based on name
 * @param { string } name - name or name fragment to look for
 * @param { number } [mode=0] - which degree of exact-ness to match the name
 *  - 0: any partial match
 *  - 1: exact match on either first, last or full name
 *  - 2: exact match on full name
 * @returns { Promise } a promise that will resolve with an array of members
 */
MemberHelper.prototype.getMemberByName = function(name, mode) {
  mode = mode || 0;
  var query = 'SELECT * FROM members WHERE name';
  if (mode == 2) {
    query += ' = \'' + name + '\'';
  } else if (mode == 1) {
    query += ' = \'' + name + '\' OR first_name = \'' + name + '\' ' +
      'OR last_name = \'' + name + '\'';
  } else {
    query += ' LIKE \'%' + name + '%\'';
  }
  var deferred = Q.defer();
  db.pool.query(query, function(err, rows) {
    if (err) { deferred.reject(err); }
    else { deferred.resolve(transformMembers(rows)); }
  });
  return deferred.promise;
};

/**
 * Helper function to transform database result rows to a nested json object
 * @private
 * @param { Row[] } rows
 * @return inflated json object according to member schema
 */
function transformMembers(rows) {
  if (Array.isArray(rows)) {
    return _.map(rows, function(row) { return transform.rowToSchema(row, schema); });
  } else {
    return transform.rowToSchema(row, schema);
  }
}

MemberHelper.prototype.schema = schema;

/**
 * Transform normalized database rows to JSON
 * @function
 * @param {( MemberRow | MemberRow[] )} rows - flat object(s) returned by database
 * @returns {( Member | Member[] )} inflated member objects(s)
 */
MemberHelper.prototype.transformMembers = transformMembers;

/**
 * A singleton instance of MemberHelper that uses a database connection to
 * lookup and retrieve information about members.
 * @module api/helpers/MemberHelper
 * @see MemberHelper
 */
module.exports = new MemberHelper();
