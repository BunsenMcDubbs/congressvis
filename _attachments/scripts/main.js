define(["helper/util", "backbone", "models/people", "views/people_view"],
  function(util, Backbone, People, PeopleView) {

  console.log("CongressViz Initialized");
  util.get('_view/member_summary').then(function(data) {
    console.log(data);
    var p = new People(data, {parse: true});
    var v = new PeopleView({collection: p, el: '#people'});
    return p;
  });
  // util.get('_view/enacted_without_Congressional_Tributes?startkey=[113,"s"]&endkey=[113,"s",{}]').then(function(data) {
  //   console.log(data);
  // });
});
