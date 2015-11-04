requirejs(["helper/util"], function(util) {
  console.log("CongressViz Initialized");
  util.get('_view/member_party?group_level=2')
    .then(function(data) { console.log(data); });
});
