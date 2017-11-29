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
 * Adds pmr with given id and category to appropriate global list.
 */
function addToGlobalList(id, category) {
	_lstEditor(category, function(lst) {
		lst.push(id);
	});
}

/*
 * Moved the pmr from its current global array to the new one.
 */
function changeGlobalList(id, currLst, newLst) {
	_lstEditor(currLst, function(lst) {
		lst.splice(lst.indexOf(id), 1);
	});
	_lstEditor(newLst, function(lst) {
		lst.push(id);
	});
}

/*
 * Performs an edit operation on one of the three global arrays. The category is used 
 * to depict which array will be edited. Once the correct array is depicted, it is 
 * passed in into an edit function which will perform whatever edit operation it needs.
 */
function _lstEditor(category, editf) {
	switch(category) {
		case 'active':
			editf(actLst);
			break;
		case 'archived':
			editf(archLst);
			break;
		case 'trash':
			editf(trshLst);
			break;
		default:
			break;
	}
}

/*
 * Adds the pmr to appropriate list.
 */
function addWidget(widget, code, category='active') {
	$('#' + category + '-list.pmr-list').append(widget);
	addToGlobalList(stripCommas(code), category);
}
