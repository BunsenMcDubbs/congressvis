var vote_helper = require('../helpers/vote-helper');

/**
 * API controller for retrieving information about congressional votes
 * @module api/controllers/votes
 * @requires api/helpers/VoteHelper
 */
var exports = {};

/**
 * GET vote information and results, which vote indicated in req params
 * automatically includes individual member votes
 */
exports.getVoteByVoteId = function(req, res, next) {
  var vote_id = req.params.vote_id;
  vote_helper.getVoteByVoteId(vote_id, true)
  .then(function (result) { res.json(result); })
  .catch(next);
};

/**
 * GET all (passage) vote information and results from a congress, indicated
 * in req params.
 * Member votes can be included if requested in query params (`include_votes=true`)
 *
 */
exports.getVotesByCongress = function(req, res, next) {
  var congress = req.params.congress;
  var include_votes = req.query.include_votes === "true";
  vote_helper.getVotesByCongress(congress, include_votes)
  .then(function (result) { res.json(result); })
  .catch(next);
};

module.exports = exports;
