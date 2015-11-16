function(doc) {
  if (doc.doc_type && doc.doc_type === "vote" && doc.bill) {
    if (doc.category === "passage") {
      var bill_id = doc.bill.type + doc.bill.number + "-" + doc.bill.congress;
      var votes = {};
      for (var voteType in doc.votes) {
        var temp = [];
        for (var idx in doc.votes[voteType]) {
          temp.push(doc.votes[voteType][idx].id);
        }
        votes[voteType] = temp;
      }
      emit([doc.bill.type, bill_id], votes);
    }
  }
};
