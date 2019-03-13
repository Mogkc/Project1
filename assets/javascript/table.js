/**
 * Creates a new table row with the given data, then appends it to the table
 * @param {Date} date The day this row will describe
 * @param {string} weatherPic The reference for that day's weather icon
 * @param {string} weatherText Info about that day's weather
 * @param {number} energy Energy production for that day
 */
var firstRow = true;
var displayRow = function (date, weatherPic, weatherText, energy) {
    var newRow = $("<tr>");
    //leftmost element is the color - blue for past, and red for future
    var dispCol = $("<td>");
    dispCol.attr("scope", "row");
    var tableColor = ""
    if (date < moment().subtract(1, "days")) {
        tableColor = '#04AAE5';
        energy = energy.toLocaleString();
    } else {
        tableColor = '#A9635E';
        if (firstRow) {
            firstRow = false;
            newRow.attr("id","firstRow");
        }
        energy = energy.toString();
        energy = "EST "+energy.slice(0, -3) + 'K';
    }
    dispCol.css("background-color",tableColor)
    newRow.append(dispCol);

    //next element is date
    var day = date.format("ddd, MMM DD");
    var dispDay = $("<td>");
    dispDay.text(day);
    // dispDay.attr("scope", "row");

    newRow.append(dispDay);
    // //Middle element holds the weather
    var dispWeath = $("<td>");
    dispWeath.attr("class", "text-center");
    //Format the button so it can show popover text
    var button = $("<button>");
    button.attr("type", "button");
    button.attr("class", "btn btn-link p-0");
    button.attr("data-container", "body");
    button.attr("data-toggle", "popover");
    button.attr("data-placement", "right");
    button.attr("data-content", weatherText);
    button.attr("data-trigger", "focus");
    // button.setContent();
    //Make the button hold the image
    var img = $("<img>");
    img.attr("class", "icon");
    img.attr("src", "assets/images/weather/" + weatherPic + ".png");
    button.append(img);
    dispWeath.append(button.popover({
        html: true
    }));

    newRow.append(dispWeath);
    //Rightmost element is energy prediction
    var energyDisp = $("<td>");
    energyDisp.attr("class", "text-right");
    energyDisp.text(energy);

    newRow.append(energyDisp);
    //Append the row to the existing table
    $("#tableData").append(newRow);
}

/**
 * Completely empties the table.
 */
var clearTable = function () {
    $("#tableData").html("");
}

