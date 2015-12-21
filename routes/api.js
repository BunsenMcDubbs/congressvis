var express = require('express');
var mysql = require('mysql');
var Q = require('q');

var member_handler = new (require('../api/members'))();
var config = require('../config').mysql || {};

function API(router) {
  this.router = router || express.Router();
  this.initializeConnectionPool().catch(this.stop);
}

// initialize the connection pool
API.prototype.initializeConnectionPool = function() {
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

// create the express router
API.prototype.createRouter = function(router) {
  var self = this;
  router = router || self.router || express.Router();
  var pool = self.pool;

  // set the `Content-Type` header to `application/json`
  // this will also trigger proper error handler to fire if needed
  router.use(function(req, res, next) {
    res.type('json');
    next();
  });

  /* GET api greeting, test db connection */
  router.get('/', function(req, res, next) {
    self.getConnection().then(function() {
      res.json({ message: 'Welcome to the Congressvis API!', ok: true });
    }, function(msg) {
      next(new Error(msg));
    });
  });

  router.get('/members', function(req, res, next) {
    self.getConnection()
    .then(function(connection) {
      return member_handler.getMemberByID(null, connection);
    })
    .then(function(results) {
      res.json({ members: results });
    }).catch(next);
  });

  router.get('/members/:id', function(req, res, next) {
    self.getConnection()
    .then(function(connection) {
      return member_handler.getMemberByID(req.params.id, connection);
    })
    .then(function(results) {
      res.json(results[0]);
    }).catch(next);
  });

  return router;
};

// retrieve a connection from the pool
API.prototype.getConnection = function(tries) {
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

API.prototype.stop = function(msg) {
  console.log((msg.trim() || 'FATAL ERROR WITH API.'), 'STOPPING.');
  process.exit(1);
};

module.exports = API;
