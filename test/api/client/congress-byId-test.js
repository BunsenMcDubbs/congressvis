/*jshint expr: true*/
var _ = require('underscore');
var expect = require('chai').expect;
var validator = new (require('z-schema'))();
var supertest = require('supertest');
var api = supertest('http://localhost:3000'); // supertest init;

var congress_schema = require('../../../api/swagger/congress.json');
var error_schema = require('../../../api/swagger/error_message.json');

describe('/congress', function() {
  describe('/{congress}', function() {
    describe('getCongressById', function() {
      it('should respond with a congress (200)', function(done) {
        api.get('/api/congress/113')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(validator.validate(res.body, congress_schema)).to.be.true;
          done();
        });
      });
    });
  });
});
