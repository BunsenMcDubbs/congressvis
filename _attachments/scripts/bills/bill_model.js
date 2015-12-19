define(['backbone'], function(Backbone) {
  var Bill = Backbone.Model.extend({
    parse: function(data) {
      // parsing a row from a query
      if (data.id && data.key && data.value) {
        var temp = {
          votes: data.value,
          vote_id: data.id,
          bill_id: data.key
        };
        data = temp;
      }
      return data;
    }
  });
  return Bill;
});
