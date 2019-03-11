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
    var day = date.getFullYear() + "/" + (date.getMonth()+1) + "/" + date.getDate();
    var dispDay = $("<td>").text(day);
    dispDay.attr("scope", "row");

    newRow.append(dispDay);
    //Middle element holds the weather
    var button = $("<button>");
    //Format the button so it can show popover text
    button.attr("class", "btn btn-link p-0");
    button.attr("data-container", "body");
    button.attr("data-toggle", "popover");
    button.attr("data-placement", "right");
    button.attr("data-content", weatherText);
    //Make the button hold the image
    var img = $("<img>");
    img.attr("src", weatherPic);
    button.append(img);

    newRow.append($("<td>").append(button) );
    //Rightmost element is energy prediction
    newRow.append("<td>").text(energy + " kW hours");

    //Append the row to the existing table
    $("#tableData").append(newRow);
}

var clearTable = function() {
    $("#tableData").html("");
}