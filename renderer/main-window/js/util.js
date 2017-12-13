/*
 * Add commas to the pmr id. Returns full pmr code.
 */
function addCommas(id) {
    return id.substr(0, 5) + ',' + id.substr(5, 3) + ',' + id.substr(8, 3);
}

/*
 * Strips commas from the pmr code. Returns the pmr id.
 */
function stripCommas(code) {
	return code.replace(/,/g, '');
}

/*
 * Adds the pmr to appropriate list.
 */
function addWidget(widget, code, category='active') {
	$('#' + category + '-list.pmr-list').append(widget);
	addToGlobalList(stripCommas(code), category);
}
