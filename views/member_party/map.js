function(doc) {
  if (doc.doc_type && doc.doc_type === "members") {
    var lastTerm = doc.terms[doc.terms.length - 1];
    emit([lastTerm.type, lastTerm.party], doc.name.official_full);
  }
};
