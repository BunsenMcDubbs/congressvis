function(doc) {
  if (doc.doc_type && doc.doc_type === "member") {
    emit(doc.id.bioguide, null);
  }
}
