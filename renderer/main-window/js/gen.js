const widgetWidth = 35;

function createWidget(code, title, severity, category='active') {
    // Truncate the title if it exceeds the widget width.
    if (title.length > widgetWidth) {
        title = title.substring(0, widgetWidth - 3);
        title += "...";
    }

    // Create the sev icon if neccessary.
    var defaultIcon = "<div class='pmr-widget-sev-icon'></div>";
    switch (severity) {
        case 1:
            // Overwrite the default icon with a red exclaimation point.
            defaultIcon = "<div class='pmr-widget-sev-icon sev1'><i class='fa fa-exclamation-triangle' aria-hidden='true'></i></div>";
            break;
        case 2:
            // Overwrite the default icon with an orange exclaimation point.
            defaultIcon = "<div class='pmr-widget-sev-icon sev2'><i class='fa fa-exclamation-circle' aria-hidden='true'></i></div>";
            break;
        default:
            break;
    }

    // Remove commas from the code.
    var id = stripCommas(code);

    // Build the widget html string.
    var widgetTitle = "<h1>" + title + "</h1>";
    var widgetCode  = "<h2>" + code + "</h2>";
    var widgetPart  = "<div class='pmr-widget-part'>" + widgetTitle + widgetCode + "</div>";
    var widget      = "<div class='pmr-widget not-dragable' id=widget-" + id + " data-section=" + id + ">" + defaultIcon + widgetPart + "</div>";

    return widget;
}

function createContent(pmr) {
    // Remove commas from the code.
    var id = stripCommas(pmr.code);

    var category = pmr.category;

    // Title and environment
    var title        = "<h1 id='pmr-title'>" + pmr.title + "</h1>";
    var env          = pmr.environment;
    var separator    = "<li>|</li>";
    var OS           = "<li><p id='pmr-os'>" + env.OS + "<p></li>";
    var JDK          = "<li><h1>JDK&nbsp</h1><p id='pmr-jdk'>" + env.JDK + "</p></li>";
    var WASVersion   = "<li><h1>WAS&nbsp</h1><p id='pmr-wasv'>" + env.WASv + "</p></li>";
    var env          = "<ul id='pmr-env-list'>" + OS + separator + JDK + separator + WASVersion + "</ul>";
    var top          = "<div class='pmr-section clearfix not-dragable' id='pmr-section-top'>" + title + env + "</div>";

    // Miscellaneous information section.
    var severity     = "<li><b>Severity: </b><p id='pmr-sev'>" + pmr.severity + "</p></li>";
    var date         = "<li><b>Date created: </b><p id='pmr-date'>" + pmr.age + "</p></li>";
    var contact      = "<li><b>Contact: </b><p id='pmr-contact'>" + pmr.contact + "</p></li>";
    var info         = "<div class='pmr-section clearfix not-dragable'><ul id='pmr-info-list'>" + severity + date + contact + "</ul></div>";

    // Description, latest update, and resolution sections.
    var description  = "<div class='pmr-section not-dragable'><h1>Description</h1><p id='pmr-description'>" + pmr.description + "</p></div>";
    var latest       = "<div class='pmr-section not-dragable'><h1>Latest Update</h1><p id='pmr-update'>" + pmr.latest + "</p></div>";
    var resolution   = "<div class='pmr-section not-dragable'><h1>Resolution</h1><p id='pmr-resolution'>" + pmr.resolution + "</p></div>";

    // Tags section.
    var tags = "";
    pmr.tags.forEach(function(tag) {
        var tagSelect = "<button class='tag-select-button'># " + tag + "</button>";
        var tagRemoveButton = "<button class='tag-remove-button'><span class='tag-remove-icon not-dragable'><i class='fa fa-times-circle-o' aria-hidden='true'></i></span></button>";
        tags += "<li><h1>" + tag + "</h1>" + tagRemoveButton + "</li>";
    });
    tags = "<div class='pmr-section clearfix not-dragable'><h1>Tags</h1><ul id='pmr-tag-list'>" + tags + "</ul></div>";

    // Wrapper div is added when the html is loaded in active_button_manager.js
    var pmr = "<div class='pmr-content is-shown' id=" + id +" data-section=" + category + ">" + 
                    top + info + description + latest + resolution + tags + "</div>";

    return pmr;
}
