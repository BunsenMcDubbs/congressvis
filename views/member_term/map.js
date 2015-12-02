function(doc) {
  if (doc.doc_type && doc.doc_type === "member") {
    for (var idx in doc.terms) {
      emit([doc.terms[idx].type, doc.terms[idx].start], null);
    }
  }
};
