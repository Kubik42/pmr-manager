function searchPmrs() {
    var filter = document.getElementById("search-field").value.toLowerCase();
    var list = document.getElementById(currActiveCategory + '-list');
    var widgets = list.getElementsByClassName('pmr-widget');

    Array.from(widgets, wgt => {
        // Search cache.
        fse.readFile(__dirname + '/renderer/main-window/cache/' + addCommas(wgt.dataset.section) + '.html', function(err, data) {
            if (err) {
                console.error('readFile: Failed to open pmr html for searching ' + wgt.dataset.section);
                console.error(err);
            } else {
                if (data.indexOf(filter) > -1) {
                    wgt.style.display = '';
                } else {
                    wgt.style.display = 'none';
                }
            }
        });
    });
}
