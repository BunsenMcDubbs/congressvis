var mysql = require('mysql');
var Q = require('q');
var _ = require('underscore');

var MemberHelper = require('./member-helper');

/**
 * Helper class for converting and retrieving congress to/from the database
 * @constructor
 * @requires api/helpers/member-helper
 */
function CongressHelper() {}

/**
 * Retrieve members that belong/attended a given congress
 * @param { Connection } connection - open MySQL connection
 * @param { number } congress - congress number to lookup members for
 * @returns { Promise } a promise that will resolve with a list of members
 */
CongressHelper.prototype.getCongressMembers = function(connection, congress) {
  var call = 'CALL getCongressMembers(' + congress + ')';
  var deferred = Q.defer();
  connection.query(call, function(err, rows) {
    if (err) { deferred.reject(err); }
    else {
      // rows[0] -> result rows, rows[1] -> status
      deferred.resolve(MemberHelper.transformMembers(rows[0]));
    }
  });
  return deferred.promise;
};

/**
 * A singleton instance of CongressHelper that uses a database connection to
 * lookup and retrieve information about congresses.
 * @module api/helpers/CongressHelper
 * @see CongressHelper
 */
module.exports = new CongressHelper();
