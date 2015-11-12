define(['underscore','backbone'], function(_, Backbone) {
  var PersonView = Backbone.View.extend({
    el: '.bio',
    template: _.template(document.getElementById('person-info').innerHTML),
    render: function() {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });
  return PersonView;
});
