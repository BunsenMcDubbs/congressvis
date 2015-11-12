function(doc) {
  if (doc.doc_type && doc.doc_type === "members") {
    var lastTerm = doc.terms[doc.terms.length - 1];
    emit(doc._id, {current: lastTerm, name: doc.name, bio: doc.bio});
  }
};
