var db = require('../db-connector');

/**
 * GET welcome message, if the database connections are working
 */
function hello(req, res, next) {
  db.getConnection().then(function() {
    res.json({ message: 'Welcome to the Congressvis API!', ok: true });
  }, function(msg) {
    next(new Error(msg));
  });
}

module.exports = {
  hello: hello
};
