define(['underscore','backbone'], function(_, Backbone) {
  var PersonView = Backbone.View.extend({
    tagName: 'div',
    template: _.template(document.getElementById('person-info').innerHTML),
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });
  return PersonView;
});
