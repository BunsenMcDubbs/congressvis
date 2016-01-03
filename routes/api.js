var express = require('express');
var cors = require('cors');

var hello = require('../api/controllers/hello');
var members = require('../api/controllers/members');
var congress = require('../api/controllers/congress');
var votes = require('../api/controllers/votes');

router = express.Router();

/** enable cors from all sources */
router.use(cors());

/**
 * Set the `Content-Type` header to `application/json`.
 * Setting this header also allows for properly formatted error messages.
 */
router.use(function(req, res, next) {
  res.type('json');
  next();
});

/** GET api greeting, test db connection */
router.get('/', hello.hello);

/** GET all members */
router.get('/members', members.getMembers);

/** GET member by id (bioguide_id) */
router.get('/members/:bioguide_id', members.getMemberById);

/** GET member by bioguide_id */
router.get('/members/byBioguideId/:bioguide_id', members.getMemberByBioguideId);

/** GET member by thomas_id */
router.get('/members/byThomasId/:thomas_id', members.getMemberByThomasId);

/** GET member by govtrack_id */
router.get('/members/byGovtrackId/:govtrack_id', members.getMemberByGovtrackId);

/** GET member by lis_id */
router.get('/members/byLisId/:lis_id', members.getMemberByLisId);

/** GET member(s) by name */
router.get('/members/byName/:name', members.getMemberByName);

/** GET member(s) by congress */
router.get('/members/byCongress/:congress',
  congress.validateCongressId,
  members.getMembersByCongress);

/** GET all congresses */
router.get('/congress', congress.getCongresses);

/** GET congress by id */
router.get('/congress/:congress',
  congress.validateCongressId,
  congress.getCongressById);

/** GET member by name */
router.get('/congress/:congress/members',
  congress.validateCongressId,
  congress.getCongressMembers);

router.get('/votes/:vote_id', votes.getVoteByVoteId);

module.exports = router;
