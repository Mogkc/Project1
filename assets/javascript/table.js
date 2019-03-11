var displayRow = function(date, weatherPic, weatherText, energy) {
    var newRow = $("<tr>");
    //Leftmost element is date
    newRow.append($("<td>").text(date) );
    //Middle element is weather
    var img = $("<img>");
    img.attr("src", weatherPic);
    img.attr("alt", weatherText);

    newRow.append($("<td>").append(img) );
    //Rightmost element is energy prediction
    newRow.append("<td>").text(energy);

    //Append the row to the existing table
    $("#data-table").append(newRow);
}

var clearTable = function() {
    $("#data-table").html("");
}