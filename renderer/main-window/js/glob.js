window.$ = window.jQuery = require('jquery');

const path = require('path');
const ipc = require('electron').ipcRenderer;
const fse = require('fs-extra');

// Global arrays for storing pmr ids.
var actLst = [];
var archLst = [];
var trshLst = [];

// Currently active pmr id.
var currActivePmrId;
