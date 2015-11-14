define(['backbone', 'person'], function(Backbone, Person) {
  var People = Backbone.Collection.extend({
    model: Person,
    parse: function(data) {
      return data.rows;
    }
  });
  return People;
});
