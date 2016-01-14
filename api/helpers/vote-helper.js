var mysql = require('mysql');
var Q = require('q');
var _ = require('underscore');

var schema = require('../swagger/vote.json');
var transform = require('../utils/transformer');

var db = require('../utils/db-connector');
var CongressHelper = require('./congress-helper');

/**
 * Helper class for converting and retrieving congressional votes
 * @constructor
 * @requires api/utils/DBConnector
 * @requires api/utils/Transformer
 */
function VoteHelper() {}

/**
 * Retrieve congressional vote from id
 * @param { string } vote_id - the vote to retrieve
 * @param { boolean } [include_votes=false] - `true` to include individual
 * member votes
 * @returns { Promise } a promise that will resolve with results from a vote
 */
VoteHelper.prototype.getVoteByVoteId = function(vote_id, include_votes) {
  include_votes = include_votes || false;
  // TODO ensure that vote_id is not null... and matches regex?
  var vote_info_query = 'SELECT vote_id, bill_id, date, category, result, question, subject FROM votes WHERE vote_id = ?';
  // query for member votes
  votes_query = 'SELECT member_bioguide_id AS bioguide_id, vote FROM member_votes WHERE vote_id = ?';
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
      if (include_votes) {
        db.pool.query(votes_query, vote_id, function(err, rows) {
          if (err) { deferred.reject(err); }
          else {
            vote.votes = _collateVotes(rows);
            deferred.resolve(vote);
          }
        });
      } else { deferred.resolve(vote); }
    }
  });
  return deferred.promise;
};

function _collateVotes(rows) {
  var votes = {};
  for (var idx in rows) {
    var row = rows[idx];
    var voteType = row.vote;
    if (!votes[voteType]) {
      votes[voteType] = [];
    }
    delete row.vote;
    votes[voteType].push(row.bioguide_id);
  }
  return votes;
}

/**
 * Retrieve all votes from a congress
 * @param { number } congress
 * @param { boolean } [include_votes=false] - `true` to include individual
 * member votes
 * @returns { Promise } a promise that will resolve with votes from a congress
 */
VoteHelper.prototype.getVotesByCongress = function(congress, include_votes) {
  var votes_query = 'SELECT vote_id, votes.bill_id FROM votes INNER JOIN bills ON bills.bill_id = votes.bill_id WHERE bills.congress = ?';

  var deferred = Q.defer();
  CongressHelper.getCongress(congress).then(function() {
    db.pool.query(votes_query, congress, function(err, rows) {
      if (err) { deferred.reject(err); }
      else if (include_votes) {
        var votes = _.indexBy(rows, 'vote_id');
        var member_vote_query = "SELECT member_bioguide_id AS bioguide_id, votes.vote_id, vote FROM member_votes INNER JOIN votes ON votes.vote_id = member_votes.vote_id INNER JOIN bills ON votes.bill_id = bills.bill_id WHERE bills.congress = ? AND votes.category = 'passage'";
        // var start = new Date().getTime();
        db.pool.query(member_vote_query, congress, function(err, rows) {
          if (err) { deferred.reject(err); }
          else {
            // var db = new Date().getTime();
            for (var i = rows.length - 1; i >= 0; i--) {
              var vote_id = rows[i].vote_id;
              if (!votes[vote_id].votes) {
                votes[vote_id].votes = {'+': [], '-': [], '0': [] };
              }
              votes[vote_id].votes[rows[i].vote].push(rows[i].bioguide_id);
            }
            // var collate = new Date().getTime();
            deferred.resolve(_.toArray(votes));
            // var finished = new Date().getTime();
            // console.log('db: ', db-start, '\tcollate: ', collate-db, '\tfinish up: ', finished-collate, '\ttotal: ', finished-start);
          }
        });
      } else {
        deferred.resolve(rows);
      }
    });
  }).catch(deferred.reject);
  return deferred.promise;
};

/** @member { JSONSchema } */
VoteHelper.prototype.schema = schema;

/**
 * A singleton instance of VoteHelper
 * @module api/helpers/VoteHelper
 * @see VoteHelper
 */
module.exports = new VoteHelper();
