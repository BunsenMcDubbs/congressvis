requirejs(["helper/util", "jquery", "d3"], function(util, $, d3) {

  console.log("CongressViz Initialized");
  util.get('_view/member_party?startkey=["rep"]&endkey=["rep",{}]&group=true')
    .then(function(data) { console.log(data); });
  $('h1')[0].textContent += " holla " + d3.version;
});
