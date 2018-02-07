const glob = require('glob');

// Process all pmr jsons in the database.
$(document).ready(function() {
	var files = glob.sync(path.join(__dirname, 'db/*/pmr.json'));
	
	if (files.length === 0) {
		$(document).trigger('completed-json-parse');
	}

	var counter = 0;
	files.forEach(function(f) {
		fse.readFile(f, function(err, data) {
			// Parse raw json into object.	
			var pmr = JSON.parse(data);

			// Create the widget html and add it to the DOM.
			var widgetHtml = createWidget(pmr.code, pmr.title, pmr.severity, pmr.category);
			addWidget(widgetHtml, pmr.code, pmr.category);

			// Create the and cache it.
			var pmrHtml = createContent(pmr);
			fse.writeFile(path.join(__dirname, 'renderer/main-window/cache', pmr.code + '.html'), pmrHtml, function(err) {
				if (err) throw err;
			});

			// Trigger after all files have been processed.
			counter++;
			if (counter === files.length) {
				$(document).trigger('completed-json-parse');
			}
		});
	});
});
