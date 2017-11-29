const { remote } = require('electron');

function createNewPMRWindow() {
    const htmlPath = path.join('file://', __dirname, 'renderer/child-windows/new-pmr/modal.html');
    let win = new remote.BrowserWindow({ 
        parent: remote.getCurrentWindow(),
        width: 600, 
        height: 350,
        minimizable: false,
        resizable: false,
        modal: true,
        show: false
    });
    win.loadURL(htmlPath);

    win.on('ready-to-show', function() {
        win.show();
        win.focus();
    });

    win.on('close', function () { 
        win = null 
    });
}
