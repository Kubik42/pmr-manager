/*
 * Adds event listeners to elements.
 */
function addEventListeners() {
    // Categories.
    const categoryBtns = document.getElementsByClassName('pmr-category-button');
    Array.from(categoryBtns, btn => btn.addEventListener('click', function(event) {
        handleCategoryTrigger(event);
    }));

    // Create new pmr.
    document.getElementById('new-pmr').addEventListener('click', function(event) {
        createNewPMRWindow();
    });

    // Widgets with event delegation.
    const pmrLists = document.getElementsByClassName('pmr-list');
    Array.from(pmrLists, lst => lst.addEventListener('click', function(event) {
        // only handle when event was fired from a widget
        if (!event.target.matches('.pmr-list') && !event.target.matches('#empty-trash-button')) {
            handleContentTrigger(event);
        }
    }));

    // Empty trash.
    document.getElementById('empty-trash-button').addEventListener('click', function(event) {
        for (var i = 0; i < trshLst.length; i++) {
            purge(trshLst[i]);
        }
    });

    // Edit buttons.
    const editBtns = document.getElementsByClassName('pmr-edit-button');
    Array.from(editBtns, btn => btn.addEventListener('click', function(event) {
        handleEditTrigger(event);
    }));

    // Search field.
    document.getElementById('search-field').addEventListener('input', searchPmrs);
}
