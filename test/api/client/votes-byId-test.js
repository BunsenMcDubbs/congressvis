/*jshint expr: true*/
var _ = require('underscore');
var expect = require('chai').expect;
var validator = new (require('z-schema'))();
var supertest = require('supertest');
var api = supertest('http://localhost:3000'); // supertest init;

var vote_schema = require('../../../api/swagger/vote.json');
var member_vote_schema = require('../../../api/swagger/member-vote.json');
var member_vote_short_schema = require('../../../api/swagger/member-vote-short.json');
var member_votes_schema = {
  type: 'array',
  items: member_vote_schema
};
var member_votes_short_schema = {
  type: 'array',
  items: member_vote_short_schema
};
var error_schema = require('../../../api/swagger/error_message.json');

describe('/votes', function() {
  describe('getVoteByVoteId', function() {
    var vote_ids = ['h101-113.2013', 'h231-113.2014'];
    var invalid_id = 'h1010-113.2013';
    _.each(vote_ids, helpTestVoteById);

    it('should respond with an error message (404)', function(done) {
      api.get('/api/votes/' + invalid_id)
      .set('Accept', 'application/json')
      .expect(404)
      .end(function(err, res) {
        if (err) return done (err);
        expect(validator.validate(res.body, error_schema)).to.be.true;
        done();
      });
    });

  });
});

function helpTestVoteById(id) {
  it('should respond with data for vote #' + id + ' (200)', function(done) {
    api.get('/api/votes/' + id)
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err, res) {
      if (err) return done (err);
      expect(validator.validate(res.body, vote_schema), 'correct vote schema').to.be.true;
      expect(res.body.votes).to.have.length.above(0);
      expect(validator.validate(res.body.votes, member_votes_schema), 'correct member-vote schema').to.be.true;
      done();
    });
  });
  it('should respond with data for vote #' + id + ' (short=false) (200)', function(done) {
    api.get('/api/votes/' + id + '?short=false')
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err, res) {
      if (err) return done (err);
      expect(validator.validate(res.body, vote_schema), 'correct vote schema').to.be.true;
      expect(res.body.votes).to.have.length.above(0);
      expect(validator.validate(res.body.votes, member_votes_schema), 'correct member-vote schema').to.be.true;
      done();
    });
  });
  it('should respond with data for vote #' + id + ' in short form (200)', function(done) {
    api.get('/api/votes/' + id + '?short=true')
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err, res) {
      if (err) return done (err);
      expect(validator.validate(res.body, vote_schema), 'correct vote schema').to.be.true;
      expect(res.body.votes_short).to.have.length.above(0);
      expect(validator.validate(res.body.votes_short, member_votes_short_schema), 'correct member-vote-short schema').to.be.true;
      done();
    });
  });

}
