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
      var ids = [1, 40, 92, 110, 113, 115];
      _.each(ids, helpTestCongressById);

      it('should respond with an error message (400)', function(done) {
        api.get('/api/congress/abcd')
        .set('Accept', 'application/json')
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          expect(validator.validate(res.body, error_schema)).to.be.true;
          done();
        });
      });

      it('should respond with an error message (404)', function(done) {
        api.get('/api/congress/5145')
        .set('Accept', 'application/json')
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          expect(validator.validate(res.body, error_schema)).to.be.true;
          done();
        });
      });
    });
  });
});

function helpTestCongressById(id) {
  it('should respond with congress #' + id + ' information (200)', function(done) {
    api.get('/api/congress/' + id)
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      expect(validator.validate(res.body, congress_schema)).to.be.true;
      done();
    });
  });
}
