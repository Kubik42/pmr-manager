// ===============================================================================
// Document triggers.
// ===============================================================================

$(document).on('completed-json-parse', function() {
    loadFromLocalStorage();
    addEventListeners();
});

$(document).on('changed-category', function(event, id, setTo) {
    document.getElementById(id).dataset.section = setTo;

    forgetWidget();

    // clone the widget, hide the original, and append the copy to the new list category.
    // the original widget will dissapear upon app refresh.
    var wgt = document.getElementById('widget-' + id);
    var wgtCopy = wgt.cloneNode(true);
    wgt.classList.add('is-hidden');
    wgt.id = null;
    document.getElementById(setTo + '-list').appendChild(wgtCopy);
});

$(document).on('purged', function(event, id) {
    forgetWidget();

    // hide widget from view.
    document.getElementById('widget-' + id).classList.add('is-hidden');
});

// ===============================================================================
// Process communication.
// ===============================================================================

/*
 * Handle new pmr creation.
 */
ipc.on('new-pmr-created', function(event, data) {
    var [code, title, severity] = data;
    handleNewPmrCreation(code, title, severity)
});
