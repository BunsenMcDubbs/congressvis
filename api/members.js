var mysql = require('mysql');
var Q = require('q');
var _ = require('underscore');

function Member() {}

/*
 * GET member(s) based on id
 * `id` <String | Array<String> | Object | null>
 *  - <String | Array<String>> for bioguide id(s), array will retrieve multiple
 *  - <Object> if specifying id other than bioguide.
 *    ex) { 'thomas_id': thomasId <String | Array<String> > }
 *    supports: - bioguide_id
 *              - thomas_id
 *              - govtrack_id
 *              - lis_id (only available for senators)
 *    if multiple id's are present, all will be retrieved
 *  - <null> will retrieve all
 */
Member.prototype.getMemberByID = function(id, connection) {
  var id_types = ['bioguide_id', 'thomas_id', 'govtrack_id', 'lis_id'];
  // build query
  var query = 'SELECT * FROM members';
  if (!id) {
    id = null;
  } else {
    if (id.constructor === Array || typeof id === 'string') {
      if (typeof id === 'string') {
        id = [id];
      }
      id = { bioguide_id : id };
    }
    query += ' WHERE ';
    var given_id_types = Object.keys(id);
    for (var i = 0; i < given_id_types.length; i++) {
      var id_type = given_id_types[i];
      if (id_types.indexOf(id_type) !== -1) {
        query += id_type + ' IN (' + connection.escape(id[id_type]) + ')';
      }
      if (i < given_id_types.length - 1) { query += ' OR '; }
    }
  }

  // query database for members
  var deferred = Q.defer();
  connection.query(query, function(err, rows) {
    if (err) { deferred.reject(err); }
    else {
      deferred.resolve(transformMembers(rows));
    }
  });
  return deferred.promise;
};

var jsonSchema = {
  id: ['bioguide_id', 'thomas_id', 'govtrack_id', 'lis_id'],
  name: ['first_name', 'last_name']
};

// define a constant variable
Object.defineProperty(Member, 'jsonSchema', {
  value: jsonSchema
});

function transformMember(row) {
  return transformRowToSchema(row, jsonSchema);
}

function transformMembers(rows) {
  return _.map(rows, function(row) { return transformMember(row); });
}

function transformRowToSchema(row, schema) {
  var json = {};
  for (var i in schema) {
    for (var j in schema[i]) {
      json[i] = json[i] || {};

      var field_name = schema[i][j];
      json[i][field_name] = row[field_name];
    }
  }
  return json;
}

module.exports = Member;
