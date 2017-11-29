const ipc = require('electron').ipcRenderer;

// submit
document.getElementById('submit').addEventListener('click', () => {
    var title = document.getElementById('title').value;
    var code = document.getElementById('code').value;
    var severity = parseInt(document.getElementsByClassName('is-selected')[0].innerText);

    // checking if inputs are valid.
    if (!_validTitle(title) || !_validCode(code) || !severity) { 
        document.getElementById('error-invalid-entires').classList.add('is-shown');
        return; 
    }

    // send title and code to main process.
    ipc.send('new-pmr-created', [title, code, severity]);
    window.close();
});

// cancel
document.getElementById('cancel').addEventListener('click', () => {
    window.close();
});

// pmr already exists
icp.on('pmr-already-exists', () => {
    document.getElementById('error-pmr-exists').classList.add('is-shown');
});

// sev buttons
const sevBtns = document.getElementsByTagName('td');
Array.from(sevBtns, btn => btn.addEventListener('click', function(event) {
    // unselect currently selected
    const curr_selected = document.querySelectorAll('td.is-selected');
    Array.prototype.forEach.call(curr_selected, function(section) {
        section.classList.remove('is-selected');
    });
    // select clicked sev
    event.currentTarget.classList.add('is-selected');
}));

function _validTitle(title) {
    return title && title.trim().length;
}

function _validCode(code) {
    return code && code.trim().length;
}

function showError(msg) {

}
