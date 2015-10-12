var map = function (doc) {
  var title = null;
  if (doc.short_title) {
    title = doc.short_title;
  } else if (doc.popular_title) {
    title = doc.popular_title;
  } else if (doc.official_title) {
    title = doc.official_title;
  } else {
    title = doc.bill_id;
  }
  if (doc.sponsor && doc.sponsor.name) {
    emit(doc.sponsor.name, title);
  }
  if (doc.cosponsors && doc.cosponsors.length > 0) {
    for (var idx in doc.cosponsors) {
      if (doc.cosponsors[idx].name && !doc.cosponsors[idx].withdrawn_at) {
        emit(doc.cosponsors[idx].name, title);
      }
    }
  }
};

var reduce = function (keys, values, rereduce) {
  if (rereduce) {
    return sum(values);
  } else {
    return values.length;
  }
};
