var vote_helper = require('../helpers/vote-helper');

var exports = {};

/**
 * GET vote information and results, which vote indicated in req params,
 * format in req query (short_form)
 */
exports.getVoteByVoteId = function(req, res, next) {
  var vote_id = req.params.vote_id;
  var short = req.query.short === "true";
  vote_helper.getVoteByVoteId(vote_id, short)
  .then(function (result) { res.json(result); })
  .catch(next);
};

module.exports = exports;
