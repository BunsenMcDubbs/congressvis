define(["helper/util", "backbone", "models/person", "views/person_view"], function(util, Backbone, Person, PersonView) {

  console.log("CongressViz Initialized");
  // util.get('_view/member_party?startkey=["rep"]&endkey=["rep",{}]&group=true')
  //   .then(function(data) { console.log(data); });
  // $('h1')[0].textContent += " holla " + d3.version;
  util.get('../../01464').then(function(data) {
    console.log(data);
    var p1 = new Person();
    p1.set(data);
    console.log(p1);
    var v1 = new PersonView({model: p1});
    console.log(v1);
    v1.render();
  });
});
