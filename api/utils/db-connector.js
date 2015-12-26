var mysql = require('mysql');
var Q = require('q');

var config = require('../../config').mysql || {};

/**
 * Handles connections to the database (MySQL and TODO Elasticsearch)
 * @constructor
 */
function DBConnector() {
  this.initializeConnectionPool().catch(this.stop);
}

/**
 * Initialize the connection pool using settings from config file
 * @returns { Promise } a promise that will resolve with the connection pool
 */
DBConnector.prototype.initializeConnectionPool = function() {
  var self = this;
  self.pool = mysql.createPool({
    connectionLimit : config.connectionLimit || 10,
    host : config.host || 'localhost',
    user : config.username || 'root',
    password : config.password || '',
    database : config.database || 'congressvis'
    // waitForConnections: false // this is a development setting to help debug bad resource management
  });
  var deferred = Q.defer();
  self.getConnection().then(
    function(connection) {
      connection.release();
      deferred.resolve();
    }, function(err) {
      // TODO this code is untested
      console.warn(err);
      self.pool = null;
      deferred.reject('PROBLEM ESTABLISHING MYSQL CONNECTION.');
  });
  return deferred.promise;
};

/**
 * Retrieve a connection from the pool
 * @returns { Promise } a promise that will resolve with a MySQL connnection
 */
DBConnector.prototype.getConnection = function() {
  var deferred = Q.defer();
  this.pool.getConnection(function(err, connection) {
    if (err) { deferred.reject(err); }
    else { deferred.resolve(connection); }
  });
  return deferred.promise;
};

/**
 * Escape strings
 * @function
 * @see node-mysql's escape function
 */
DBConnector.prototype.escape = mysql.escape;

/**
 * Log an error message and stop the process
 * @param { String } msg - error message
 */
DBConnector.prototype.stop = function(msg) {
  console.log((msg.trim() || 'FATAL ERROR WITH DATABASE CONNECTION.'), 'STOPPING.');
  process.exit(1);
};

/**
 * A singleton instance of DBConnector that establishes and manages database connections
 * @module api/utils/DBConnector
 * @see DBConnector
 */
module.exports = new DBConnector();
