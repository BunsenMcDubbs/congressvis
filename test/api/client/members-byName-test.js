/*jshint expr: true*/
var _ = require('underscore');
var expect = require('chai').expect;
var validator = new (require('z-schema'))();
var supertest = require('supertest');
var api = supertest('http://localhost:3000/api/members/byName/'); // supertest init;

var member_schema = require('../../../api/swagger/member.json');
var error_schema = require('../../../api/swagger/error_message.json');
var members_schema = { type: 'array' };
members_schema.items = member_schema;

describe('/members', function() {
  describe('/byName/{name}', function() {
    var full_match = 'marilyn lloyd';
    var part_match = 'arthur';
    var name_frag = 'ich';
    var no_match = 'qpxst';

    describe('exact_full match', function(done) {

      it('should respond with a list with at least one member (full name) (200)',
        function(done) {
          api.get(full_match + '?exact_full=true')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) { return done(err); }
            expect(validator.validate(res.body, members_schema)).to.be.true;
            expect(res.body, 'number of members').to.have.length.of.at.least(1);
            done();
          });
        }
      );

      it('should respond with an empty list (no match) (200)', function(done) {
        api.get(no_match + '?exact_full=true')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) { return done(err); }
          expect(res.body, 'number of members').to.have.length(0);
          done();
        });
      });

      it('should respond with an empty list (name part), exact_full overriding exact (200)',
        function(done) {
          api.get(part_match + '?exact_full=true&exact=false')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) { return done(err); }
            expect(res.body, 'number of members').to.have.length(0);
            done();
          });
        }
      );

      it('should respond with an empty list (name part), exact_full overriding exact (200)',
        function(done) {
          api.get(part_match + '?exact_full=true&exact=true')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) { return done(err); }
            expect(res.body, 'number of members').to.have.length(0);
            done();
          });
        }
      );
    });

    describe('exact match', function(done) {

      it('should respond with a list with at least one member (full name) (200)',
        function(done) {
          api.get(full_match + '?exact=true')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) { return done(err); }
            expect(validator.validate(res.body, members_schema)).to.be.true;
            expect(res.body, 'number of members').to.have.length.of.at.least(1);
            done();
          }
        );
      });


      it('should respond with a list with at least one member (name part) (200)',
        function(done) {
          api.get(part_match + '?exact=true')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) { return done(err); }
            expect(validator.validate(res.body, members_schema)).to.be.true;
            expect(res.body, 'number of members').to.have.length.of.at.least(1);
            done();
          }
        );
      });

      it('should respond with an empty list (name fragment) (200)', function(done) {
        api.get(name_frag + '?exact=true')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) { return done(err); }
          expect(res.body, 'number of members').to.have.length(0);
          done();
        });
      });
    });


    describe('partial match', function(done) {

      it('should respond with a list with at least one member (full name) (200)',
        function(done) {
          api.get(full_match)
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) { return done(err); }
            expect(validator.validate(res.body, members_schema)).to.be.true;
            expect(res.body, 'number of members').to.have.length.of.at.least(1);
            done();
            }
          );
        }
      );

      it('should respond with a list with at least one member (name part) (200)',
        function(done) {
          api.get(part_match)
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) { return done(err); }
            expect(validator.validate(res.body, members_schema)).to.be.true;
            expect(res.body, 'number of members').to.have.length.of.at.least(1);
            done();
            }
          );
        }
      );

      it('should respond with a list with at least one member (name fragment) (200)',
        function(done) {
          api.get(name_frag)
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) { return done(err); }
            expect(res.body, 'number of members').to.have.length.of.at.least(1);
            done();
          });
        }
      );

      it('should respond with an empty list (no match) (200)', function(done) {
        api.get(no_match)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) { return done(err); }
          expect(res.body, 'number of members').to.have.length(0);
          done();
        });
      });

    });

  });
});
