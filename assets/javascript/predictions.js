var generatesOn = {
    /* TO BE MODIFIED BASED ON API USED FOR WEATHER */
    sunny,
    partiallySunny,
    partiallyCloudy,
    cloudy,
    showers
}

/**
 * 
 * @param {string} dayWeather 
 */
var predict = function(dayWeather) {

    switch (dayWeather) {
        case "sunny":
            return generatesOn.sunny;
        case "partiallySunny":
            return generatesOn.partiallyCloudy;
        //Update based on api used for weather
    }
}

/**
 * 
 * @param {array} weatherHist The previous 30 days' weather, oldest at 0
 * @param {object array} energyHist The previous 30 days' dates and energy production, oldest at 0
 */
var correlateProduction = function(weatherHist, energyHist) {
    /* TO BE MODIFIED BASED ON API USED FOR WEATHER */

    //Create variables for averaging energy based on weather
    //i.e.
    var numSun = 0, genSun = 0;
    var numPSun = 0, genPSun = 0;
    //etc

    //Use sort the energy generated by that day's weather
    for(let i = 0; i < 30; i++) {
        switch (weatherHist[i]) {
            case "sunny":
                numSun++;
                genSun += energyHist[i].powerGenerated;
                break;
            case "partiallySunny":
                numPSun++;
                genPSun += energyHist[i].powerGenerated;
                break;
            //etc
        }
    }

    //Update predictions using the sorted data's averages
    generatesOn.sunny = (genSun / numSun);
    generatesOn.partiallySunny = (genPSun / numPSun);
    //etc
}