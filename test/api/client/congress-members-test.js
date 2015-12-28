/*jshint expr: true*/
var _ = require('underscore');
var expect = require('chai').expect;
var validator = new (require('z-schema'))();
var supertest = require('supertest');
var api = supertest('http://localhost:3000'); // supertest init;

var member_schema = require('../../../api/swagger/member.json');
var error_schema = require('../../../api/swagger/error_message.json');
var members_schema = { type: 'array' };
members_schema.items = member_schema;

describe('/congress', function() {
  describe('/{congress}/members', function() {
    describe('getCongressMembers', function() {
      this.slow(150); // tweak the 'slow' criteria to be more accomodating
      testHelper('/api/congress/113/members', '/api/congress/abcd/members','/api/congress/1234/members');
    });
  });
});

describe('/members', function() {
  describe('/byCongress/{congress}', function() {
    describe('getMembersByCongress', function() {
      this.slow(150);
      testHelper('/api/members/byCongress/113', '/api/members/byCongress/abcd', '/api/members/byCongress/1234');
    });
  });
});

function testHelper(valid_url, invalid_url, notfound_url) {
  it('should respond with a list of all members from that congress (200)',
    function(done) {
      api.get(valid_url)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) { return done(err); }
        expect(res.body).to.have.length.of.at.least(1);
        expect(validator.validate(res.body, members_schema)).to.be.true;
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
