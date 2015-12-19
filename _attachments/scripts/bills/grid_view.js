define(['underscore', 'backbone', 'd3', 'bills/bill_model', 'bills/bills_model'],
function(_, Backbone, d3, Bill, Bills) {

  var GridView = Backbone.View.extend({
    initialize: function(options) {
      this.data = options.data;
      if (options.people) {
        this.people = options.people;
        if (!_.isArray(this.people)) {
          this.people = _.map(this.people.models, function(model) { return model.attributes.bioguide; });
        }
      }
    },
    render: function() {
      var self = this;
      var rows = d3.select(self.el)
        .append('div').attr('class', 'grid-view-wrapper')
        .selectAll('.row')
        .data(self.data)
        .enter()
        .append('div')
        .attr('class', function(datum) { return 'row ' + datum.id; });
      var names = rows.append('div')
        .attr('class', 'billname')
        .text(function(datum) { return "Vote #" + datum.id + " for Bill #"+ datum.key[2]; });
      var votes = rows.selectAll('.vote')
        .data(function(datum) {
          var votes = [];
          for (var idx in self.people) {
            var vote = {person: self.people[idx], vote: 'N/A'};
            for (var voteType in datum.value) {
              if (_.contains(datum.value[voteType], vote.person)) {
                vote.vote = voteType;
              }
            }
            votes.push(vote);
          }
          // console.log(votes);
          return votes;
        })
        .enter()
        .append('div')
        // .text(function(datum) { return datum.vote; });
        .attr('class', function(d) {
          var voteClass = d.vote.toLowerCase().replace(/\s+/g, '-');
          if (d.vote === "Aye" || d.vote === "Yea") {
            voteClass = "yes";
          } else if (d.vote === "No" || d.vote === "Nay") {
            voteClass = "no";
          } else if (d.vote === "Not Voting") {
            voteClass = "not-voting";
          } else if (d.vote === "Present") {
            voteClass = "present";
          }
          return "vote " + voteClass;
        });
      return this;
    }
  });
  return GridView;
});
