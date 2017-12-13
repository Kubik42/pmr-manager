const ipc = require('electron').ipcRenderer;

// Submit.
document.getElementById('submit').addEventListener('click', () => {
    var title = document.getElementById('title').value;
    var code = document.getElementById('code').value;
    var severity = document.getElementsByClassName('is-selected');

    // checking if inputs are valid.
    if (!_validTitle(title) || !_validCode(code) || !severity.length) { 
        _hideOther('p.is-shown', 'is-shown');
        document.getElementById('error-invalid-form').classList.add('is-shown');
        return;
    }
    // send to main process.
    ipc.send('new-pmr-created', [code, title, parseInt(severity[0].innerText)]);
});

// Cancel.
document.getElementById('cancel').addEventListener('click', () => {
    window.close();
});

// Sev buttons.
const sevBtns = document.getElementsByTagName('td');
Array.from(sevBtns, btn => btn.addEventListener('click', function(event) {
    _hideOther('td.is-selected', 'is-selected');
    event.currentTarget.classList.add('is-selected');
}));

// -------------------------------------------------------------------------------------

// PMR already exists.
ipc.on('pmr-already-exists', () => {
    _hideOther('p.is-shown', 'is-shown');
    document.getElementById('error-pmr-exists').classList.add('is-shown');
});

// PMR created successfully.
ipc.on('pmr-created-success', () => {
    window.close();
});

// PMR failed to create, some error occurred.
ipc.on('pmr-creation-failed', () => {
    _hideOther('p.is-shown', 'is-shown');
    document.getElementById('error-failed-to-create').classList.add('is-shown');
});

// -------------------------------------------------------------------------------------

function _validTitle(title) {
    return title && title.trim().length;
}

function _validCode(code) {
    return code && code.trim().length;
}

/*
 * Removes className class from elements with given identifier.
 */
function _hideOther(identifier, className) {
    const curr_shown = document.querySelectorAll(identifier);
    if (curr_shown.length) { curr_shown[0].classList.remove(className); }
}
