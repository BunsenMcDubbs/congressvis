var mysql = require('mysql');
var Q = require('q');
var _ = require('underscore');

var schema = require('../swagger/vote.json');
var transform = require('../utils/transformer');

var db = require('../utils/db-connector');

function VoteHelper() {}

VoteHelper.prototype.getVoteByVoteId = function(vote_id, short_votes) {
  // TODO ensure that vote_id is not null... and matches regex?
  var vote_info_query = 'SELECT vote_id, bill_id, date, category, result, question, subject FROM votes WHERE vote_id = ?';
  var votes_query = 'SELECT bioguide_id, vote, display_as, state, name FROM member_votes INNER JOIN members ON members.bioguide_id = member_votes.member_bioguide_id WHERE vote_id = ?';
  if (short_votes) {
    votes_query = 'SELECT member_bioguide_id AS bioguide_id, vote FROM member_votes WHERE vote_id = ?';
  }
  var deferred = Q.defer();
  db.pool.query(vote_info_query, vote_id, function(err, rows) {
    if (err) { deferred.reject(err); }
    else if (rows.length === 0) {
      err = new Error('Cannot find vote #' + vote_id);
      err.status = 404;
      deferred.reject(err);
    } else if (rows.length !== 1) { defered.reject(new Error('more than one vote_id match')); }
    else {
      var vote = transform.rowToSchema(rows[0], schema);
      db.pool.query(votes_query, vote_id, function(err, rows) {
        if (err) { deferred.reject(err); }
        else {
          if (short_votes) { vote.votes_short = rows; }
          else { vote.votes = rows; }
          deferred.resolve(vote);
        }
      });
    }
  });
  return deferred.promise;
};

module.exports = new VoteHelper();
