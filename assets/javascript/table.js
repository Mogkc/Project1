/**
 * 
 * @param {Date} date The day this row will describe
 * @param {url} weatherPic The url for that day's weather icon
 * @param {string} weatherText Info about that day's weather
 * @param {string} energy Energy production for that day
 */
var displayRow = function(date, weatherPic, weatherText, energy) {
    var newRow = $("<tr>");
    //Leftmost element is date
    var day = date.format("dddd, MMMM Do");
    var dispDay = $("<td>");
    dispDay.text(day);
    dispDay.attr("scope", "row");

    newRow.append(dispDay);
    // //Middle element holds the weather
    var dispWeath = $("<td>") ;
    dispWeath.attr("scope", "row");
    var button = $("<button>");
    //Format the button so it can show popover text
    button.attr("type", "button");
    button.attr("class", "btn btn-link p-0");
    button.attr("data-container", "body");
    button.attr("data-toggle", "popover");
    button.attr("data-placement", "right");
    button.attr("data-content", weatherText);
    button.attr("data-trigger", "focus");
    //Make the button hold the image
    var img = $("<img>");
    img.attr("src", weatherPic);
    button.append(img);
    dispWeath.append(button);

    newRow.append(dispWeath);
    //Rightmost element is energy prediction
    var energyDisp = $("<td>");
    energyDisp.attr("class", "text-right");
    energyDisp.text(energy + " kW hours");

    newRow.append(energyDisp);
    //Append the row to the existing table
    $("#tableData").append(newRow);
}

var clearTable = function() {
    $("#tableData").html("");
}

var displayFuture = function(daysOut) {
    var day = moment();
    //Starts by predicting today's output
    for(let daysOut = 0; daysOut < howManyDays; daysOut++) {
        //Call for that day's weather prediction from weather API
        //Use this as the callback: displayRow(day, <pic from weather>, <text from weather>, generatesOn);
        day.add(1, 'days');
    }
}
