/*jshint expr: true*/
var _ = require('underscore');
var expect = require('chai').expect;
var validator = new (require('z-schema'))();
var supertest = require('supertest');
var api = supertest('http://localhost:3000'); // supertest init;

var member_schema = require('../../../api/swagger/member.json');
var error_schema = require('../../../api/swagger/error_message.json');

describe('/members', function() {
  // semi random selection of member ids from more recent congresses
  var ids = {
    bioguide_id: ['B000944', 'M000404', 'C000858', 'Z000017'],
    thomas_id: ['01531', '00116', '00869', '01597'],
    govtrack_id: ['412454', '300025', '300052', '411834'],
    lis_id: ['S174', 'S254', 'S142', 'S075']
  };
  var invalid_id = '0';

  function helpValidateResponse(url, code, schema) {
    return function _helpValidateResponse(done) {
      api.get(url)
      .set('Accept', 'application/json')
      .expect(code)
      .end(function(err, res) {
        if (err) { return done(err); }
        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });
    };
  }

  describe('/{bioguide_id}', function() {
    describe('getMemberByID (bioguide_id)', function() {
      var url = '/api/members/';
      _.each(ids.bioguide_id, function(id) {
        it('should respond with a member with bioguide_id: ' + id + ' (200)',
          helpValidateResponse(url + id, 200, member_schema));
      });

      it('should respond with an error message (404)',
        helpValidateResponse(url + invalid_id, 404, error_schema));
    });
  });

  describe('/byBioguideId/{bioguide_id}', function() {
    describe('getMemberByBioguideId', function() {
      var url = '/api/members/byBioguideId/';
      _.each(ids.bioguide_id, function(id) {
        it('should respond with a member with bioguide_id: ' + id + ' (200)',
          helpValidateResponse(url + id, 200, member_schema));
      });

      it('should respond with an error message (404)',
        helpValidateResponse(url + invalid_id, 404, error_schema));
    });
  });

  describe('/byThomasId/{thomas_id}', function() {
    describe('getMemberByThomasId', function() {
      var url = '/api/members/byThomasId/';
      _.each(ids.thomas_id, function(id) {
        it('should respond with a member with thomas_id: ' + id + ' (200)',
          helpValidateResponse(url + id, 200, member_schema));
      });

      it('should respond with an error message (404)',
        helpValidateResponse(url + invalid_id, 404, error_schema));
    });
  });

  describe('/byGovtrackId/{govtrack_id}', function() {
    describe('getMemberByGovtrackId', function() {
      var url = '/api/members/byGovtrackId/';
      _.each(ids.govtrack_id, function(id) {
        it('should respond with a member with govtrack_id: ' + id + ' (200)',
          helpValidateResponse(url + id, 200, member_schema));
      });

      it('should respond with an error message (404)',
        helpValidateResponse(url + invalid_id, 404, error_schema));
    });
  });

  describe('/byLisId/{lis_id}', function() {
    describe('getMemberByLisId', function() {
      var url = '/api/members/byLisId/';
      _.each(ids.lis_id, function(id) {
        it('should respond with a member with lis_id: ' + id + ' (200)',
          helpValidateResponse(url + id, 200, member_schema));
      });

      it('should respond with an error message (404)',
        helpValidateResponse(url + invalid_id, 404, error_schema));
    });
  });
});
