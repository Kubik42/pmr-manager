/*
 * Reads the json for the specified pmr and passes its parsed form to a callback 
 * function. The callback should make changes to the json and return it. This result 
 * is then written back to the pmr json. Upon completion of the write, an optional 
 * trigger function is called to trigger any post-process events.
 */
function jsonEditor(filePath, savePath, editFunction, callback) {
    fse.readFile(filePath, function(err, fdata) {
        if (err) {
            console.error('readFile: Failed to open file ' + filePath);
            console.error(err);
        }
        var json = editFunction(JSON.parse(fdata));
        fse.writeFile(savePath, JSON.stringify(json, null, 4), function(err) {
            if (callback) callback();
            if (err) {
                console.error('writeFile: Failed to write file ' + outPath);
                console.error(err);
            }
        });
    }); 
}
