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
  describe('{congress}/members', function() {
    testHelper('/api/congress/113/members', '/api/congress/0/members');
  });
});

describe('/members', function() {
  describe('/byCongress/{congress}', function() {
    testHelper('/api/members/byCongress/113', '/api/members/byCongress/0');
  });
});

function testHelper(valid_url, invalid_url) {
  it('should respond with a list of all members who serve in that congress (200)',
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
  it('should respond with an error message (404)',
    function(done) {
      api.get(invalid_url)
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
