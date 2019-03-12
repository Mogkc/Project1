var generatesOn = {
    //Will be filled by correlatePredictions
};

/**
 * Gets the history for energy production and weather, calls another function to correlate them, and populates the table.
 * @param {number} siteID The ID of the site the user is interested in, if empty defaults to Richard Moore's
 * @param {moment} endDate Optional, if empty is set to yesterday
 * @param {moment} startDate Optional, requires endDate. If empty defaults to 30 days prior to endDate
 */
var getWeatherAndEnergyHist = function (siteID, endDate, startDate) {
    if (siteID === undefined) {
        siteID = "961882";
    }
    if (endDate == undefined) {
        endDate = moment().subtract(1, 'days');
    }
    if (startDate == undefined) {
        startDate = moment().subtract(30, 'days');
    }
    getProductionHistory(siteID, startDate.format("X"), endDate.format("X"), function (prodHist) {
        showWeather("1600 Amphitheatre Parkway, Mountain View,California", startDate.format("X"), endDate.format("X"), function (weathHist) {
            correlateProduction(prodHist, weathHist, function () {
                //loop through them creating table rows for historical data
                for (let i = 0; i < prodHist.length; i++) {
                    var day = prodHist[i].date;
                    displayRow(moment.unix(prodHist[i].dateUnix), weathHist[day].icon, weathHist[day].summary, prodHist[i].powerGenerated);
                }
                displayFuture();
            });
        }, false);
    });
}


/**
 * Starting today, creates table rows based on predicted weather and energy
 * @param {number} howManyDays How many days (including today) to predict. Defaults to 7
 */
var displayFuture = function (howManyDays) {
    if (howManyDays === undefined) {
        howManyDays = 7;
    }
    var day = moment();
    //Get the forcast
    showWeather("1600 Amphitheatre Parkway, Mountain View,California", day.format("X"), day.add(howManyDays, 'days').format("X"), function (weatherHist) {
        console.log("Got Future Data");
        console.log(weatherHist);
        //Undo the addition in showWeather's parameters
        day.subtract(howManyDays, 'days');
        //Use the forecast to predict the energy generated
        for(var daysOut = 0; daysOut < howManyDays; daysOut++) {
            let prediction = weatherHist[day.format("YYYY-MM-DD")];
            console.log(prediction);
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
            displayRow(day, prediction.icon, prediction.summary, generated);
            day.add(1, 'days');
        }
    }, true);
}

/**
 * 
 * @param {array} weatherHist The previous 30 days' weather, oldest at 0
 * @param {object array} energyHist The previous 30 days' dates and energy production, oldest at 0
 * @param {function} callback The function to be started after the future is correlated
 */
var correlateProduction = function (weatherHist, energyHist, callback) {
    //Create variables for averaging energy based on weather. M is mostly
    var numSunny = 0, genSunny = 0;
    var numMSunny = 0, genMSunny = 0;
    var numMCloudy = 0, genMCloudy = 0;
    var numCloudy = 0, genCloudy = 0;


    //Use sort the energy generated by that day's weather
    for (let i = 0; i < weatherHist.length && i < energyHist.length; i++) {
        var day = energyHist[i].date;
        //weatherHist array uses day as key. Cloudcover range is 0-1
        if (weatherHist[day].cloudCover < .25) {
            numSunny++;
            genSunny += energyHist[i];
        } else if (weatherHist[day].cloudCover < .5) {
            numMSunny++;
            genMSunny += energyHist[i];
        } else if (weatherHist[day].cloudCover < .7) {
            numMCloudy++;
            genMCloudy += energyHist[i];
        } else {
            numCloudy++;
            genCloudy += energyHist[i];
        }
    }

    //Update predictions using the sorted data's averages
    generatesOn.sunny = (genSunny / numSunny);
    generatesOn.mostlySunny = (genMSunny / numMSunny);
    generatesOn.mostlyCloudy = (genMCloudy / numMCloudy);
    generatesOn.cloudy = (genCloudy / numCloudy);

    callback();
};