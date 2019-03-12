/**
 * Creates a new table row with the given data, then appends it to the table
 * @param {Date} date The day this row will describe
 * @param {string} weatherPic The reference for that day's weather icon
 * @param {string} weatherText Info about that day's weather
 * @param {number} energy Energy production for that day
 */
var displayRow = function (date, weatherPic, weatherText, energy) {
    var newRow = $("<tr>");
    //Leftmost element is date
    var day = date.format("dddd, MMMM Do");
    var dispDay = $("<td>");
    dispDay.text(day);
    dispDay.attr("scope", "row");

    newRow.append(dispDay);
    // //Middle element holds the weather
    var dispWeath = $("<td>");
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

/**
 * Completely empties the table.
 */
var clearTable = function () {
    $("#tableData").html("");
}

/**
 * Starting today, creates table rows based on predicted weather and energy
 * @param {number} howManyDays How many days (including today) to predict. Defaults to 7
 */
var displayFuture = function (howManyDays) {
    if(howManyDays === undefined) {
        howManyDays = 7;
    }
    var day = moment();
    //Get the forcast
    showWeather("1600 Amphitheatre Parkway, Mountain View,California", day.format("X"), day.add(howManyDays, 'days').format("X"), function (weathHist) {
        //Undo the addition in showWeather's parameters
        day.subtract(howManyDays, 'days');
        //Use the forecast to predict the energy generated
        array.forEach(prediction => {
            let generated;
            if (prediction.cloudCover < .25) {
                generated = generatesOn.sunny;
            } else if (prediction.cloudCover < .5) {
                generated = generatesOn.mostlySunny;
            } else if (prediction.cloudCover < .7) {
                generated = generatesOn.mostlyCloudy;
            } else {
                generated = generatesOn.cloudy;
            }
            //Update the table
            //displayRow(day, <pic>, weather.summary, generated);
            day.add(1, 'days');
        });
    }, true);
}
