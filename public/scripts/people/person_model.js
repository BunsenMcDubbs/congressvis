define(['backbone'], function(Backbone) {
  var Person = Backbone.Model.extend({
    parse: function(data) {
      // full couchdb query (by default - thomas - id)
      if (data.rows && data.rows.length == 1) {
        var id = data.id;
        data = data.rows[0].value;
        data.id = id;
      }
      // individual row from query (member_summary)
      if (data.id && data.key && data.value) {
        data.value.id = data.key;
        data = data.value;
      }
      // console.log(data);

      // point 'current' attribute to last term
      if (data.terms && data.terms.length > 0 && !data.current) {
        data.current = data.terms[data.terms.length - 1];
      }
      return data;
    }
  });

  return Person;
});
