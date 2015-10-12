var map = function(doc) {
  var title = doc.official_title;
  var sponsors = [doc.sponsor.name];
  if (doc.history.enacted) {
    if (doc.short_title) { title = doc.short_title; }
    if (doc.popular_title) { title = doc.popular_title; }
    if (doc.cosponsors && doc.cosponsors.length > 0) {
      for (var idx in doc.cosponsors) {
        sponsors.push(doc.cosponsors[idx].name);
      }
    }
    emit(title, sponsors);
  }
};
