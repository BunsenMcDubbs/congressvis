var db = require('../utils/db-connector');

/**
 * API controller for returning a welcome message after checking db connections
 * @module api/controllers/hello
 * @requires api/utils/DBConnector
 */
var exports = {};

/**
 * GET welcome message, if the database connections are working
 */
exports.hello = function(req, res, next) {
  db.getConnection().then(function() {
    res.json({ message: 'Welcome to the Congressvis API!', ok: true });
  }, function(msg) {
    next(new Error(msg));
  });
};

module.exports = exports;
