define(["helper/util", "backbone", "models/people", "views/people_view"],
  function(util, Backbone, People, PeopleView) {

  console.log("CongressViz Initialized");
  // util.get('_view/member_party?startkey=["rep"]&endkey=["rep",{}]&group=true')
  //   .then(function(data) { console.log(data); });
  // $('h1')[0].textContent += " holla " + d3.version;
  util.get('_view/member_summary').then(function(data) {
    console.log(data);
    var p = new People(data, {parse: true});
    console.log(p);
    var v = new PeopleView({collection: p});
    console.log(v);
    // var v1 = new PersonView({model: p1});
    // console.log(v1);
    // $('.people')[0].appendChild(v1.el);
    // v1.render();
    return p;
  });
});
