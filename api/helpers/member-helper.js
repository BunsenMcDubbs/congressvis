var mysql = require('mysql');
var Q = require('q');
var _ = require('underscore');

/**
 * Helper class for converting and retrieving members to/from the database
 * @constructor
 */
function MemberHelper() {}

/**
 * Retrieve member(s) based on id
 * @param { Connection } connection - open MySQL connection
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
MemberHelper.prototype.getMemberByID = function(connection, id) {
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
        query += id_type + ' IN (' + connection.escape(id[id_type]) + ')';
      }
      if (i < given_id_types.length - 1) { query += ' OR '; }
    }
  }

  // query database for members
  var deferred = Q.defer();
  connection.query(query, function(err, rows) {
    if (err) { deferred.reject(err); }
    else {
      deferred.resolve(transformMembers(rows));
    }
  });
  return deferred.promise;
};

/**
 * Retrieve member(s) based on name
 * @param { Connection } connection - open MySQL connection
 * @param { string } name - name or name fragment to look for
 * @param { number } [mode=0] - which degree of exact-ness to match the name
 *  - 0: any partial match
 *  - 1: exact match on either first, last or full name
 *  - 2: exact match on full name
 * @returns { Promise } a promise that will resolve with an array of members
 */
MemberHelper.prototype.getMemberByName = function(connection, name, mode) {
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
  connection.query(query, function(err, rows) {
    if (err) { deferred.reject(err); }
    else {
      deferred.resolve(transformMembers(rows));
    }
  });
  return deferred.promise;
};

var jsonSchema = {
  id: ['bioguide_id', 'thomas_id', 'govtrack_id', 'lis_id'],
  name: ['first_name', 'last_name']
};

// define a constant variable
Object.defineProperty(MemberHelper, 'jsonSchema', {
  value: jsonSchema
});

/**
 * Transform normalized database rows to JSON
 * @private
 * @param {( MemberRow | MemberRow[] )} rows - flat object(s) returned by database
 */
function transformMembers(rows) {
  if (Array.isArray(rows)) {
    return _.map(rows, function(row) { return transformRowToSchema(row, jsonSchema); });
  } else {
    return transformRowToSchema(row, jsonSchema);
  }
}

/**
 * Transform normalized database row to JSON
 * @todo move this to a seperate helper
 * @private
 * @param { Row } row - flat object returned by database
 * @param { Schema } schema - object indicating the format of final json object
 */
function transformRowToSchema(row, schema) {
  var json = {};
  for (var i in schema) {
    for (var j in schema[i]) {
      json[i] = json[i] || {};

      var field_name = schema[i][j];
      json[i][field_name] = row[field_name];
    }
  }
  return json;
}

/**
 * A singleton object that uses a database connection to lookup and retrieve
 * member information.
 * @module api/helpers/MemberHelper
 */
module.exports = new MemberHelper();
