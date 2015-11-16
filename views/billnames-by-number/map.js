function(doc) {
  if (doc.doc_type && doc.doc_type === 'bill') {
    if (doc.short_title) {
      emit(doc.number, doc.short_title);
    } else {
      emit(doc.number, doc.official_title);
    }
  }
};
