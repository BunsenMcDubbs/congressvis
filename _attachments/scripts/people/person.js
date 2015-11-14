define(['backbone'], function(Backbone) {
  var Person = Backbone.Model.extend({
    parse: function(data) {
      if (data.rows && data.rows.length == 1) {
        var id = data.id;
        data = data.rows[0].value;
        data.id = id;
      }
      if (data.id && data.key && data.value) {
        data.value.id = data.key;
        data = data.value;
      }
      // console.log(data);
      if (data.terms && data.terms.length > 0 && !data.current) {
        data.current = data.terms[data.terms.length - 1];
      }
      return data;
    }
  });

  return Person;
});
