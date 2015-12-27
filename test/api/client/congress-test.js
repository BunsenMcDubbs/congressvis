/*jshint expr: true*/
var _ = require('underscore');
var expect = require('chai').expect;
var validator = new (require('z-schema'))();
var supertest = require('supertest');
var api = supertest('http://localhost:3000'); // supertest init;

var congress_schema = require('../../../api/swagger/congress.json');
var error_schema = require('../../../api/swagger/error_message.json');
var congresses_schema = { type: 'array' };
congresses_schema.items = congress_schema;

describe('/congress', function() {
  describe('getCongresses', function() {
    it('should respond with a list of all congresses (200)', function(done) {
      api.get('/api/congress')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(validator.validate(res.body, congresses_schema)).to.be.true;
        done();
      });
    });
  });
});
