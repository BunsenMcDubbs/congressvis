function(doc) {
  var lastTerm = doc.terms[doc.terms.length - 1];
  emit([lastTerm.type, lastTerm.party], doc._id);
};
