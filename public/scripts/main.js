define(["helper/util", "backbone", "people/people_model", "people/people_view", "bills/grid_view"],
  function(util, Backbone, People, PeopleView, GridView) {

  console.log("CongressViz Initialized");
  // util.get('_view/member_summary').then(function(data) {
  //   console.log(data);
  //   var p = new People(data, {parse: true});
  //   var v = new PeopleView({collection: p, el: '#people'});
  //   return p;
  // });
  // util.get('_view/enacted_without_Congressional_Tributes?startkey=[113,"s"]&endkey=[113,"s",{}]').then(function(data) {
  //   console.log(data);
  // });
  util.get('_view/member_summary')
  .then(function(data) {
    var p = new People(data, {parse: true});
    return p;
  })
  .then(function(people) {
    util.get('_view/vote_passage?startkey=["h","hr"]&endkey=["h","hr",{}]')
    .then(function(data) {
      var g = new GridView({people: people, data: data.rows, el: '#viz'});
      console.log(g);
      g.render();
    });
  });

});
