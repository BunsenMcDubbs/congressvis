/**
 * Transform between normalized database rows and nested JSON
 * @module api/helpers/transformer
 */
var exports = {};

/**
 * Transform normalized database row to JSON.
 * This function DOES NOT support arrays inside the object.
 * @function
 * @param { Row } row - flat object returned by database
 * @param { JSONSchema } schema - object indicating the format of final json object
 * @param { ?string } key - only used in the function's recursion for non-object
 * values (do not use for objects - it is ignored)
 * @returns { object } inflated (now nested) json object complaint with
 * the provided schema
 * @todo add support for `x-sqlcolumnname` field for key lookup when names aren't the same
 * @todo enforce required fields?
 * @todo type validation?
 * @todo general JSON schema validation?
 */
exports.rowToSchema = rowToSchema;

function rowToSchema(row, schema, key) {
  var inflated = null;
  var type = schema.type.toLowerCase();

  if (type === 'object') { // if it is an object, recursively inflate
    inflated = {};
    var props = schema.properties;
    var required = schema.required || []; // TODO use this in the future
    for (var prop in props) {
      inflated[prop] = rowToSchema(row, props[prop], prop);
    }
  } else if (row[key]) { // otherwise return the value indicated by the key
    inflated = row[key];
  }

  return inflated;
}

module.exports = exports;
