/*
//Sample Call
Object.size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
showWeather("961882","","", function(res1){
    console.log(Object.size(res1));
    console.log(res1);
},true);
*/

/*
 Gets the address by site ID and run the getLatitudeLongitude()
 @param siteID: site ID provided by user
 @param startDate: start date but not in use
 @param endDate: end date but not in use
 @param callback: a function to call when all data is done
 @param isFuture: either true(if future) or false(if history)
 */
function showWeather(siteID, startDate, endDate, callback, isFuture) {
    getSiteInfo(siteID, function (res) {
        var address = res.streetAddress + "," + res.streetCity + "," + res.streetState + " " + res.zip;
        runWeatherFunction(address, startDate, endDate, callback, isFuture);
    });

}

//START - Google Maps API
/*
 Gets latitude and longitude base on address and run function to get weather data
 @param siteID: site ID provided by user
 @param startDate: start date but not in use
 @param endDate: end date but not in use
 @param callback: a function to call when all data is done
 @param isFuture: either true(if future) or false(if history)
 */
function runWeatherFunction(address, startDate, endDate, callback, isFuture) {
    var res = [];
    var latLong = [];
    var apiKey = "AIzaSyDs3kB9GH643iw3aYL1egJilXsG0L39HFo";
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        latLong = [response.results[0].geometry.location.lat, response.results[0].geometry.location.lng];
        //res = runShowWeatherByDateRange(latLong, startDate, endDate, callback);
        if (isFuture) { showWeatherFuture(latLong, callback); }
        else { showWeatherHistory(latLong, callback); }
    });
}
//END - Google Maps API

//runShowWeatherByDateRange([32.8531813,-117.1826385], "2019-03-15", "2019-03-14",function(res){
//console.log(res);
//});
/*
 function to run weather by date range. startDate has to be greater than endDate
 @param latLong: latitude and longitude. latLong[lat,long]
 @param startDate: start date but not in use
 @param endDate: end date but not in use
 @param callback: a function to call when all data is done
 */
function runShowWeatherByDateRange(latLong, startDate, endDate, callback) {
    let thisHour = moment().format("HH");
    let startDateUnix = moment(startDate).format('X');
    let endDateUnix = moment(endDate).format('X');
    let startDate1 = startDate + " " + thisHour;
    let endDate1 = endDate + " " + thisHour;
    let startDiff = moment(startDate1).diff(moment(), "hours");
    let endDiff = moment(endDate1).diff(moment(), "hours");
    let startDiffDays = moment(startDate1).diff(moment(), "days");
    let endDiffDays = moment(endDate1).diff(moment(), "days");
    //console.log(startDiff + " hours --- days" + startDiffDays + " --- modulus " + (startDiff / 24));
    //console.log(endDiff + " hours --- days" + endDiffDays + " --- modulus " + (endDiff / 24));

    let future = 0;
    let history = 0;
    let arrayFuture = [];
    //if startDate == 0, then end date is history
    if (startDiff === 0) {
        showWeatherByDate(latLong, moment().unix());
        for (var i = 0; i <= (endDiffDays * -1); i++) {
            theDate = moment().subtract(history, 'days').unix();
            //showWeatherByDate(latLong, theDate,callback);
            history++;
        }
    }
    //if endDate == 0, then start date is future
    else if (endDiff === 0) {
        for (var i = 0; i < (startDiffDays + 2); i++) {
            theDate = moment().add(future, 'days').unix();
            //showWeatherByDate(latLong, theDate, callback);
            future++;
        }
    }
    //if stardate & enddate > 0, then dates are future
    else if (startDiff > 0 && endDiff > 0) {
        future = Math.ceil(endDiff / 24);
        for (var i = 0; i < Math.ceil(startDiff / 24); i++) {
            theDate = moment().add(future, 'days').unix();
            //showWeatherByDate(latLong, theDate, callback);
            future++;
        }
    }
    //if stardate & enddate < 0, then dates are history
    else if (startDiff < 0 && endDiff < 0) {
        history = startDiffDays * -1;
        for (var i = 0; i < (endDiffDays * -1); i++) {
            theDate = moment().subtract(history, 'days').unix();
            //showWeatherByDate(latLong, theDate,callback);
            history++;
        }
    }
}

/*
 function to get weather information by date
 @param latLong: latitude and longitude. latLong[lat,long]
 @param theDate: theDate in unix format
 @param callback: a function to call when all data is done
 */
function showWeatherByDate(latLong, theDate, callback) {
    var results = [];
    var lat = 32.8531813;
    var long = -117.1826385;
    if (latLong) { lat = latLong[0]; long = latLong[1]; }

    var apiKey = "8692514483fc6517f978c21cd04dae3b";
    var queryURL = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/" + apiKey + "/" + lat + "," + long + "," + theDate + "?units=us&exclude=minutely,hourly";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var idx = moment.unix(response.daily.data[0].time).format("YYYY-MM-DD");
        results[idx] = {
            unixTime: moment(idx).format('X'),
            date: idx,
            tempMax: response.daily.data[0].temperatureMax,
            tempMin: response.daily.data[0].temperatureMin,
            cloudCover: response.daily.data[0].cloudCover,
            humidity: response.daily.data[0].humidity,
            summary: response.daily.data[0].summary,
            icon: response.daily.data[0].icon,
            pressure: response.daily.data[0].pressure,
            windSpeed: response.daily.data[0].windSpeed,
        };
        //check dates if today or less than today or greater than today then push to results
        callback(results);
    });
}

/*
 function to show weather information for 7 days forecast
 @param latLong: latitude and longitude. latLong[lat,long]
 @param callback: a function to call when all data is done
 */
function showWeatherFuture(latLong, callback) {
    var results = [];
    var future = 0;
    var history = 0;
    var theDate = moment().unix();
    var lat = 32.8531813;
    var long = -117.1826385;
    var totalResult = 0;
    if (latLong) { lat = latLong[0]; long = latLong[1]; }

    for (var i = 0; i <= 6; i++) {
        theDate = moment().add(future, 'days').unix(); future++;
        var apiKey = "8692514483fc6517f978c21cd04dae3b";
        var queryURL = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/" + apiKey + "/" + lat + "," + long + "," + theDate + "?units=us&exclude=minutely,hourly";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var idx = moment.unix(response.daily.data[0].time).format("YYYY-MM-DD");
            results[idx] = {
                unixTime: moment(idx).format('X'),
                date: idx,
                tempMax: response.daily.data[0].temperatureMax,
                tempMin: response.daily.data[0].temperatureMin,
                cloudCover: response.daily.data[0].cloudCover,
                humidity: response.daily.data[0].humidity,
                summary: response.daily.data[0].summary,
                icon: response.daily.data[0].icon,
                pressure: response.daily.data[0].pressure,
                windSpeed: response.daily.data[0].windSpeed,
            };
            if (totalResult == 6) callback(results);
            totalResult++;
        });
    }
}

/*
 function to show weather information for previous 1 month
 @param latLong: latitude and longitude. latLong[lat,long]
 @param callback: a function to call when all data is done
 */
function showWeatherHistory(latLong, callback) {
    var results = [];
    var future = 7;
    var history = 1;
    var theDate = moment().unix();
    var lat = 32.8531813;
    var long = -117.1826385;
    var totalResult = 0;
    if (latLong) { lat = latLong[0]; long = latLong[1]; }

    for (var i = 0; i < 30; i++) {
        theDate = moment().subtract(history, 'days').unix(); history++;
        var apiKey = "8692514483fc6517f978c21cd04dae3b";
        var queryURL = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/" + apiKey + "/" + lat + "," + long + "," + theDate + "?units=us&exclude=minutely,hourly";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var idx = moment.unix(response.daily.data[0].time).format("YYYY-MM-DD");
            results[idx] = {
                unixTime: moment(idx).format('X'),
                date: idx,
                tempMax: response.daily.data[0].temperatureMax,
                tempMin: response.daily.data[0].temperatureMin,
                cloudCover: response.daily.data[0].cloudCover,
                humidity: response.daily.data[0].humidity,
                summary: response.daily.data[0].summary,
                icon: response.daily.data[0].icon,
                pressure: response.daily.data[0].pressure,
                windSpeed: response.daily.data[0].windSpeed
            };
            if (totalResult == 29) callback(results);
            totalResult++;
        });
    }
}
//START - Dark Sky API