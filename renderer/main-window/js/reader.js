window.$ = window.jQuery = require('jquery');

const glob = require('glob');
const fs = require('fs');

// Process all pmrs in the database.
$(document).ready(function() {
	var files = glob.sync(path.join(__dirname, '../json/db/*/pmr.json'));
	var counter = 0;
	files.forEach(function(f) {
		fs.readFile(f, function(err, data) {
			var pmr = JSON.parse(data);

			// Create the widget html and add it to the DOM.
			var widgetHtml = createWidget(pmr.code, pmr.title, pmr.severity, pmr.category);
			addWidget(widgetHtml, pmr.code, pmr.category);

			// Create the and cache it.
			var pmrHtml = createContent(pmr);
			fs.writeFile(path.join(__dirname, '../cache/' + stripCommas(pmr.code) + '.html'), pmrHtml, function(err) {
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
