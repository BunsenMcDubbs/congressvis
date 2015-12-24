var mysql = require('mysql');
var Q = require('q');

var config = require('../config').mysql || {};

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
  });
  var deferred = Q.defer();
  self.getConnection(1).then(
    function(pool) {
      deferred.resolve(pool);
    }, function() {
      self.pool = null;
      deferred.reject('PROBLEM ESTABLISHING MYSQL CONNECTION.');
  });
  return deferred.promise;
};

/**
 * Retrieve a connection from the pool
 * @returns { Promise } a promise that will resolve with a MySQL connnection
 */
DBConnector.prototype.getConnection = function(tries) {
  tries = !isNaN(parseInt(tries)) ? tries : 5;
  var pool = this.pool;
  var deferred = Q.defer();

  function helper(tries) {
    if (tries <= 0) {
      deferred.reject('PROBLEM FETCHING CONNECTION FROM POOL');
    }
    else {
      pool.getConnection(function(err, connection) {
        if (err) {
          console.log('failed to get connection');
          helper(tries - 1);
        } else { deferred.resolve(connection); }
      });
    }
  }
  helper(tries);

  return deferred.promise;
};

/**
 * Log an error message and stop the process
 * @param { String } msg - error message
 */
DBConnector.prototype.stop = function(msg) {
  console.log((msg.trim() || 'FATAL ERROR WITH DATABASE CONNECTION.'), 'STOPPING.');
  process.exit(1);
};

module.exports = new DBConnector();
