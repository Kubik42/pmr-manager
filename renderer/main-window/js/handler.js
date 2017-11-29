const fse = require('fs-extra');

// ===============================================================================
// Handlers
// ===============================================================================

function handleCategoryTrigger(event) {
    hideOtherCategoriesAndDeselectButtons('.pmr-category-button', '.pmr-list');

    // Highlight clicked category button
    event.currentTarget.classList.add('is-selected');

    // Show pmr list
    var pmrList = document.getElementById(event.target.dataset.section + '-list');
    if (pmrList) pmrList.classList.add('is-shown');

    // Save currently active button in localStorage
    saveToLocalStorage(event.currentTarget.getAttribute('id'), 'activeCategoryButtonId');
}

function handleContentTrigger(event) {
    hideOtherCategoriesAndDeselectButtons('.pmr-widget', '.pmr-content', '.edit-bar');

    // Check what element was clicked and propagate up until the widget if necessary.
    var target = event.target.closest('.pmr-widget');
    var pmrId = target.dataset.section;

    // Highlight clicked category button.
    target.classList.add('is-selected');

    // Show pmr content
    showPMR(pmrId);

    // Save currently active widget in localStorage
    currActivePmrId = pmrId;
    saveToLocalStorage(pmrId, 'activePmrId');
}

function handleEditTrigger(event) {
    switch (event.currentTarget.id) {
        case 'pmr-archive-button':
            setCategory(currActivePmrId, 'archived');
            break;
        case 'pmr-unarchive-button':
            setCategory(currActivePmrId, 'active');
            break;
        case 'pmr-save-button':
            save(currActivePmrId);
            break;
        case 'pmr-delete-button':
            setCategory(currActivePmrId, 'trash');
            // Save previous category to local storage.
            var prevCategory = document.getElementById(currActivePmrId).dataset.section;
            saveToLocalStorage(prevCategory, 'restore-' + currActivePmrId);
            break;
        case 'pmr-purge-button':
            purge(currActivePmrId);
            break;
        case 'pmr-restore-button':
            // pass in restore() as the callback
            getFromLocalStorage('restore-' + currActivePmrId, restore);
            break;
        default:
            break;
    }
}

// ===============================================================================
// File reader
// ===============================================================================

/*
 * Reads the json for the specified pmr and passes its parsed form to a callback 
 * function. The callback should make changes to the json and return it. This result 
 * is then written back to the pmr json. Upon completion of the write, an optional 
 * trigger function is called to trigger any post-process events.
 */
function fileReader(id, trigger, callback) {
    var code = addCommas(id);
    fse.readFile(path.join(__dirname, 'renderer/main-window/json/db', code, 'pmr.json'), function(err, data) {
        var json = JSON.parse(data);
        json = callback(json);
        fse.writeFile(path.join(__dirname, 'renderer/main-window/json/db', code, 'pmr.json'), JSON.stringify(json, null, 4), function(err) {
            if (err) throw err;
            if (trigger) trigger();
        });
    }); 
}

// ===============================================================================
// Helpers
// ===============================================================================

/*
 * Hide all content that was previously activated by a button, and deactivate the button
 * with the given button class.
 */
function hideOtherCategoriesAndDeselectButtons(buttonClass, ...sectionClasses) {
    // Hide previously shown section(s)
    sectionClasses.forEach(function(sectionClass) {
        const sections = document.querySelectorAll(sectionClass + '.is-shown');
        Array.prototype.forEach.call(sections, function(section) {
            section.classList.remove('is-shown');
        });
    });

    // Deselect previously selected button
    const buttons = document.querySelectorAll(buttonClass + '.is-selected');
    Array.prototype.forEach.call(buttons, function(button) {
        button.classList.remove('is-selected');
    });
}

/*
 * Load or show the contents of the specified PMR.
 */
function showPMR(id) {
    var pmr = document.getElementById(id);
    if (pmr) {
        // content has already been loaded in
        pmr.classList.add('is-shown');
        showEditBar(pmr.dataset.section);
    } else {
        // Load in for the first time
        $.get('renderer/main-window/cache/' + id + '.html', function(cont) {
            $('#content').append(cont);
            showEditBar(document.getElementById(id).dataset.section);
        });
    }
}

/*
 * Display the edit bar for the specified category.
 */
function showEditBar(category) {
    document.getElementById(category + '-edit-bar').classList.add('is-shown');
}

/*
 * Saves any in-app changes to the db.
 */
function save(id) {
    var pmr = document.getElementById(id);
    function callback(json) {
        json.title            = pmr.querySelector('#pmr-title').textContent;

        json.environment.OS   = pmr.querySelector('#pmr-os').textContent;
        json.environment.JDK  = pmr.querySelector('#pmr-jdk').textContent;
        json.environment.WASv = pmr.querySelector('#pmr-wasv').textContent;

        json.severity         = parseInt(pmr.querySelector('#pmr-sev').textContent);
        json.age              = pmr.querySelector('#pmr-date').textContent;
        json.contact          = pmr.querySelector('#pmr-contact').textContent;

        json.description      = pmr.querySelector('#pmr-description').textContent;
        json.latest           = pmr.querySelector('#pmr-update').textContent;
        json.resolution       = pmr.querySelector('#pmr-resolution').textContent; 

        // TODO: find a way to preserve newlines
        return json;
    }
    fileReader(id, null, callback);
}

/*
 * Forever deletes the PMR from the database.
 */
function purge(id) {
    fse.remove('db/' + addCommas(id), function(err) {
        if (err) throw err;
        $(document).trigger('purged', [id])
    });
    // remove stored restore point
    removeFromLocalStorage('restore-' + id);
}

/*
 * Restores the PMR to the category it was previously under.
 */
function restore(restoreTo) {
    if (restoreTo) {
        setCategory(currActivePmrId, restoreTo);
    } else {
        // restore to active by default
        setCategory(currActivePmrId, 'active');
    }
}

/*
 * Sets the category of the PMR to the specified one and writes it back to the xml.
 */
function setCategory(id, setTo) {
    function trigger() {
        $(document).trigger('changed-category', [id, setTo]);
    }
    function callback(json) {
        changeGlobalList(id, json.category, setTo);
        json.category = setTo;
        return json;
    }
    fileReader(id, trigger, callback);
}

/*
 * Hide the currently selected widget, its pmr, and edit bar. Remove its references from storage.
 */ 
function forgetWidget() {
    // hide the currently selected widget, pmr, and edit bar.
    hideOtherCategoriesAndDeselectButtons('.pmr-widget', '.pmr-content', '.edit-bar');

    // clear storage.
    removeFromLocalStorage('activeWidgetId');
    removeFromLocalStorage('activePmrId');

    // remove reference to the currently active pmr.
    currActivePmrId = null;
}
