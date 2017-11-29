const { app, BrowserWindow } = require('electron');
const path = require('path')
const url = require('url')
const glob = require('glob');
const fs = require('fs');
const ipc = require('electron').ipcMain;    

var mainWindow = null;

ipc.on('new-pmr-created', function (event, data) {
    var dir = 'renderer/main-window/json/db/' + data[1];
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    } else {
        event.sender.send('pmr-already-exists');
    }
    // cp main-window/json/template.json main-window/json/db/code/code.pmr
    mainWindow.webContents.send('new-pmr-created', data);
});

app.on('ready', function () {
    // if another process is already open, focus to it instead
    if (makeSingleInstance()) {
        console.log("Another instance of the app is already running. Closing...");
        return app.quit();
    }
    // otherwise, start the app
    createWindow();
    loadScripts();
});

app.on('window-all-closed', function () {
    cleanup();
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// Adds inspect element.
require('electron-context-menu')({
    prepend: (params, mainWindow) => [{
        label: 'Rainbow',
        // Only show it when right-clicking images 
        visible: params.mediaType === 'image'
    }]
});

function createWindow() {
    // Create the main window.
    const htmlPath = path.join('file://', __dirname, 'index.html');
	mainWindow = new BrowserWindow({
		titleBarStyle: 'hidden',
		width: 1400, 
		height: 900, 
		title: app.getName(),
        show: false
    });
    mainWindow.loadURL(htmlPath);

    // Show the window once its been fully loaded in.
    mainWindow.on('ready-to-show', function() {
        mainWindow.show();
        mainWindow.focus();
    });

    // Destroy the window instance when its close.
    mainWindow.on('closed', function () {
        cleanup();
        mainWindow = null;
	});
}

/*
 * Makes the app a single instance.
 */
function makeSingleInstance () {
	if (process.mas) return false;

	return app.makeSingleInstance(function () {
		// focus on the currently running process instead of opening a new one
   		if (mainWindow) {
    		if (mainWindow.isMinimized()) mainWindow.restore();
    		mainWindow.focus();
    	}
  	});
}

/*
 * Loads in all main-proccess scripts.
 */
function loadScripts() {
	var files = glob.sync(path.join(__dirname, 'main/*.js'));
	files.forEach(function(file) {
        console.log('loaded '+ file);
		require(file);
	});
}

/*
 * Clean up before closing.
 */
function cleanup() {
	// Clear cached html files.
	var cachedPMRs = glob.sync(path.join(__dirname, 'renderer/main-window/cache/*.html'));
    console.log('clearing cache...');
	cachedPMRs.forEach(function(file) {
		fs.unlinkSync(file);
        console.log('removed ' + file);
	});
}
