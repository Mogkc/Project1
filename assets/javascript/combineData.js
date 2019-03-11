var getWeatherAndEnergyHist = function(callback) {
    var span = setDataSpan();
    getProductionHistory(siteID, span.start.format("X"), span.end.format("X"), function(prodHist) {
        //Get the weather history. In its callback
        //loop through them creating table rows, then pass them to correlatePredictions
    });
}