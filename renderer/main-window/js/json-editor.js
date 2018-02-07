/*
 * Parses the json at the specified filePath and passes it to an edit function. The edit 
 * function makes changes to the json and returns it. The result is then written to 
 * savePath. An optional callback can be passed in and will execute after the write.
 */
function jsonEditor(filePath, savePath, editf, callback) {
    fse.readFile(filePath, function(err, fdata) {
        if (err) {
            console.error('readFile: Failed to open file for editing ' + filePath);
            console.error(err);
        } else {
            var json = editf(JSON.parse(fdata));
            fse.writeFile(savePath, JSON.stringify(json, null, 4), function(err) {
                if (err) {
                    console.error('writeFile: Failed to write file ' + savePath);
                    console.error(err);
                } else {
                    if (callback) callback();
                }
            });
        }
    }); 
}
