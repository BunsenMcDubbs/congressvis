define(['backbone', 'underscore'], function(Backbone, _) {
  var Group = Backbone.Model.extend({
    // model: Person,
    parse: function(data) {
      return _.reduce(data.rows, function(obj) {
        return {
          name: obj.value,
          id: obj.id,
          type: obj.key[0],
          party: obj.key[1]
        };
      });
    },

  });
});
