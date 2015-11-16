function(doc) {
  if (doc.doc_type && doc.doc_type === "vote" && doc.bill && doc.category === "passage") {
    var bill_id = doc.bill.type + doc.bill.number + "-" + doc.bill.congress;
    emit(bill_id, doc.votes);
  }
};
