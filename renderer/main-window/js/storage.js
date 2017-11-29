const storage = require('electron-json-storage');

/*
 * Activates any active (shown/selected) elements from the previous run of the app.
 */
function loadFromLocalStorage() {
    // category
    storage.get('activeCategoryButtonId', function(err, id) {
        if (err) throw err;

        if (id && id.length) {
            document.getElementById(id).click();
        } else {
            activateDefaultCategory();
        }
    });
    // widget
    storage.get('activePmrId', function(err, id) {
        if (err) throw err;

        if (id && id.length) {
            currActivePmr = id;
            document.getElementById('widget-' + id).click();
        }
    });
}

/*
 * Returns the value associated with the given key from local storage if
 * the key exists, otherwise returns null.
 */
function getFromLocalStorage(key, callback) {
    storage.get(key, function(err, xKey) {
        if (err) throw err;
        callback(xKey);
    });
}

/*
 * Saves value to local storage under the specified key.
 */
function saveToLocalStorage(value, key) {
    storage.set(key, value, function (err) {
        if (err) throw err;
    });
}

/*
 * Removes the specified key from local storage if it exists.
 */
function removeFromLocalStorage(key) {
    storage.remove(key, function(err) {
        if (err) throw err;
    });
}

/*
 * Activates default category.
 */
function activateDefaultCategory () {
    document.getElementById('pmr-category-active').click();
}
