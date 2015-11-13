define(['underscore', 'backbone', 'views/person_view'],
function(_, Backbone, PersonView) {
  var PeopleView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.collection, 'add', this.addOne);
      this.collection.each(this.addOne, this);
    },
    addOne: function(person) {
      var view = new PersonView({model: person});
      this.$el.append(view.render().el);
    }
  });
  return PeopleView;
});
