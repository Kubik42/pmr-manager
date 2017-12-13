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

/*
 * Adds pmr with given id and category to appropriate global list.
 */
function addToGlobalList(id, category) {
    _lstEditor(category, function(lst) {
        lst.push(id);
    });
}

/*
 * Moved the pmr from its current global array to the new one.
 */
function changeGlobalList(id, currLst, newLst) {
    _lstEditor(currLst, function(lst) {
        lst.splice(lst.indexOf(id), 1);
    });
    _lstEditor(newLst, function(lst) {
        lst.push(id);
    });
}

/*
 * Performs an edit operation on one of the three global arrays. The category is used 
 * to depict which array will be edited. Once the correct array is depicted, it is 
 * passed in into an edit function which will perform whatever edit operation it needs.
 */
function _lstEditor(category, editf) {
    switch(category) {
        case 'active':
            editf(actLst);
            break;
        case 'archived':
            editf(archLst);
            break;
        case 'trash':
            editf(trshLst);
            break;
        default:
            break;
    }
}
