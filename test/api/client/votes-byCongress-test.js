/*jshint expr: true*/
var _ = require('underscore');
var expect = require('chai').expect;
var validator = new (require('z-schema'))();
var supertest = require('supertest');
var api = supertest('http://localhost:3000/api'); // supertest init

var vote_schema = require('../../../api/swagger/vote.json');
var votes_schema = {
  type: 'array',
  items: vote_schema
};
var error_schema = require('../../../api/swagger/error_message.json');

describe('/votes', function() {
  describe('/byCongress/{congress}', function() {
    describe('getVotesByCongress', function() {
      testHelper('/votes/byCongress/113', '/votes/byCongress/asdf', '/votes/byCongress/1234');
    });
  });
});

describe('/congress', function() {
  describe('/{congress}/votes', function() {
    describe('getCongressVotes', function() {
      testHelper('/congress/113/votes', '/congress/asdf/votes', '/congress/1234/votes');
    });
  });
});

function testHelper(valid_url, invalid_url, notfound_url) {
  it('should respond with all votes from a congress (200)',
    function(done) {
      api.get(valid_url)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) { return done(err); }
        expect(res.body).to.have.length.of.at.least(1);
        expect(validator.validate(res.body, votes_schema)).to.be.true;
        expect(res.body[0].votes, 'votes').to.be.undefined;
        done();
      });
    }
  );
  it('should respond with all votes from a congress with member votes(200)',
    function(done) {
      this.slow(1600);
      api.get(valid_url + '?include_votes=true')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) { return done(err); }
        expect(res.body).to.have.length.of.at.least(1);
        expect(validator.validate(res.body, votes_schema)).to.be.true;
        expect(res.body[0]).to.have.property('votes').which.is.an('object');
        done();
      });
    }
  );
  it('should respond with all votes from a congress (no member votes) (200)',
    function(done) {
      api.get(valid_url + '?include_votes=false')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) { return done(err); }
        expect(res.body).to.have.length.of.at.least(1);
        expect(validator.validate(res.body, votes_schema)).to.be.true;
        expect(res.body[0].votes, 'votes').to.be.undefined;
        done();
      });
    }
  );
  it('should respond with an error message (400)',
    function(done) {
      api.get(invalid_url)
      .set('Accept', 'application/json')
      .expect(400)
      .end(function(err, res) {
        if (err) { return done(err); }
        expect(validator.validate(res.body, error_schema)).to.be.true;
        done();
      });
    }
  );
  it('should respond with an error message (404)',
    function(done) {
      api.get(notfound_url)
      .set('Accept', 'application/json')
      .expect(404)
      .end(function(err, res) {
        if (err) { return done(err); }
        expect(validator.validate(res.body, error_schema)).to.be.true;
        done();
      });
    }
  );
}
