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
