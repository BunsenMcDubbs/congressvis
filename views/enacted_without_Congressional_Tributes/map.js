function(doc) {
  if (doc.doc_type && (doc.doc_type === 's' || doc.doc_type === 'hr')) {
    var title = doc.official_title;
    var sponsors = [doc.sponsor.name];
    if (doc.history.enacted && doc.subjects_top_term != "Congressional tributes" && doc.subjects.indexOf("Congressional tributes") == -1) {
      if (doc.short_title) { title = doc.short_title; }
      if (doc.popular_title) { title = doc.popular_title; }
      if (doc.cosponsors && doc.cosponsors.length > 0) {
        for (var idx in doc.cosponsors) {
          sponsors.push(doc.cosponsors[idx].name);
        }
      }
      emit(title, sponsors);
    }
  }
};
