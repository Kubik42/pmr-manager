/*
 * Searches through all PMRs in the database for the string input in the
 * search field.
 */
function searchPmrs() {
    var filter = document.getElementById("search-field").value.toLowerCase();
    var list = document.getElementById(currActiveCategory + '-list');
    var widgets = list.getElementsByClassName('pmr-widget');

    Array.from(widgets, wgt => {
        // Search cache.
        fse.readFile(__dirname + '/db/' + addCommas(wgt.dataset.section) + '/pmr.json', function(err, fdata) {
            if (err) {
                console.error('readFile: Failed to open file for editing');
                console.error(err);
            } else {
                if (_containsValue(JSON.parse(fdata), filter)) {
                    wgt.style.display = '';
                } else {
                    wgt.style.display = 'none'
                }
            }
        });
    });
}

/*
 * Searches the given json recursively for the given value. Returns true if 
 * that value exists and false otherwise.
 */
function _containsValue(json, value) {
    for (k in json) {
        if (typeof json[k] === 'object') {
            if (_containsValue(json[k], value)) {
                return true;
            }
        } else if (typeof json[k] === 'string' && json[k].toLowerCase().indexOf(value) > -1) {
            return true;
        }
    }
    return false;
}
