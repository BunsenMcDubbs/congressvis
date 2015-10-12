var map = function(doc) {
	if (doc.short_title) {
		emit(doc.number, doc.short_title);
	} else {
		emit(doc.number, doc.official_title);
	}
};
