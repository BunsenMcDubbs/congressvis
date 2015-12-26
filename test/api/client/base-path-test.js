/*jshint expr: true*/
var expect = require('chai').expect;
var validator = new (require('z-schema'))();
var supertest = require('supertest');
var api = supertest('http://localhost:3000'); // supertest init;

var welcome_schema = require('../../../api/swagger/welcome.json');
var error_schema = require('../../../api/swagger/error_message.json');

describe('/', function() {
  describe('get', function() {
    it('should respond with 200 ok', function(done) {
      api.get('/api/')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        expect(validator.validate(res.body, welcome_schema)).to.be.true;
        done();
      });
    });

    it.skip('should respond with default error', function(done) {
      api.get('/api/')
      .set('Accept', 'application/json')
      .expect(function(res) {
        if (res.status == 200) {
          return new Error("database should be disconnected and return an error status");
        }
      })
      .end(function(err, res) {
        if (err) return done(err);

        expect(validator.validate(res.body, error_schema)).to.be.true;
        done();
      });
    });

  });

});
