window.$ = window.jQuery = require('jquery');

const path = require('path')
const fs = require('fs');

$(document).ready(function() {
	fs.readFile(path.join(__dirname, '../json/tag.json'), function(err, data) {
		var json = JSON.parse(data);
		var counter = 0;
		json.tags.forEach(function(tag) {
			addTag(tag);
			// Trigger for when all tags have been processed.
			counter++;
			if (counter === json.tags.length) {
				$(document).trigger('completed-tag-parse');
			}
		});
	});
});

/*
 * Adds tag to index.
 */
function addTag(tag) {
	var tagName = "<button class='tag-select-button'># " + tag.name + "</button>";
	var tagRemoveIcon = "<button class='tag-remove-button'><span class='tag-remove-icon not-dragable'><i class='fa fa-times-circle-o' aria-hidden='true'></i></span></button>";
	var elem = "<div class='tag not-dragable'>" + tagName + tagRemoveIcon + "</div>";
	$('.tags').append(elem);
}
