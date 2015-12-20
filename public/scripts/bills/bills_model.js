define(['backbone', 'bills/bill_model'], function(Backbone, Bill) {
  var Bills = Backbone.Collection.extend({
    model: Bill,
    parse: function(data) {
      return data.rows;
    }
  });
  return Bills;
});
