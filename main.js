const { app, BrowserWindow } = require('electron');
const path = require('path')
const url = require('url')
const glob = require('glob');
const fs = require('fs');
const fse = require('fs-extra');
const ipc = require('electron').ipcMain;    

var mainWindow = null;

ipc.on('new-pmr-created', function (event, data) {
    var code= data[0];
    if (!fs.existsSync('db/' + code)) {
        fs.mkdirSync('db/' + code);
        fse.copy(path.join(__dirname, 'resources/template.json'), path.join(__dirname, 'db', code, 'pmr.json'), err => {
            if (err) {
                console.error('copy: Failed to copy template.json to db/' + code + '/pmr.json');
                console.error(err);
                event.sender.send('pmr-creation-failed');
                fse.remove('db/' + code);
            } else {
                mainWindow.webContents.send('new-pmr-created', data);
                event.sender.send('pmr-created-success');
            }
        });
    } else {
        event.sender.send('pmr-already-exists');
    }
});

app.on('ready', function () {
    // If another process is already open, focus to it instead
    if (makeSingleInstance()) {
        console.log("Another instance of the app is already running. Closing...");
        return app.quit();
    }
    // Otherwise, start the app
    createWindow();
    loadScripts();

    // Create missing directories
    if (!fs.existsSync('renderer/main-window/cache')) {
        fs.mkdirSync('renderer/main-window/cache');
    }
    if (!fs.existsSync('db')) {
        fs.mkdirSync('db');
    }
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
