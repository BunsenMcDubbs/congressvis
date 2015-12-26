/*jshint expr: true*/
var expect = require('chai').expect;
var validator = new (require('z-schema'))();
var supertest = require('supertest');
var api = supertest('http://localhost:3000'); // supertest init;

var member_schema = require('../../../api/swagger/member.json');
var error_schema = require('../../../api/swagger/error_message.json');
var members_schema = { type: 'array' };
members_schema.items = member_schema;

describe('/members', function() {
  describe('get', function() {
    it('should respond with 200 successful operation', function(done) {
      api.get('/api/members')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(validator.validate(res.body[0], member_schema)).to.be.true;
        done();
      });
    });
  });
});
