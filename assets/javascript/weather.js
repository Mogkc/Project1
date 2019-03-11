showWeather("1600 Amphitheatre Parkway, Mountain View,California","","", function(res1){
});

//START - Google Maps API
//get latitude and longitude base on address 
function showWeather(address, startDate, endDate, callback) {
    var res = [];
    var latLong = [];
    var apiKey = "AIzaSyDs3kB9GH643iw3aYL1egJilXsG0L39HFo";
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        //console.log(response);
        latLong = [response.results[0].geometry.location.lat, response.results[0].geometry.location.lng];
        //res = runShowWeatherByDate(latLong, startDate, endDate, callback);
        res[0] = showWeatherFuture(latLong, callback);
        res[1] = showWeatherHistory(latLong, callback);
    });
    return res;
}
//END - Google Maps API


//function to run weather by date
function runShowWeatherByDate(latLong, startDate, endDate, callback) {
    let thisHour = moment().format("HH");
    let startDateUnix = moment(startDate).format('X');
    let endDateUnix = moment(endDate).format('X');
    let startDate1 = startDate + " " + thisHour;
    let endDate1 = endDate + " " + thisHour;
    let startDiff = moment(startDate1).diff(moment(), "hours");
    let endDiff = moment(endDate1).diff(moment(), "hours");
    let startDiffDays = moment(startDate1).diff(moment(), "days");
    let endDiffDays = moment(endDate1).diff(moment(), "days");

    let future = 0; //7
    let history = 1;
    let arrayFuture = [];
    //if startDate == 0, then end date is history
    if (startDiff === 0) {
        showWeatherByDate(latLong, moment().unix());
        for (var i = 0; i < (endDiffDays * -1); i++) {
            theDate = moment().subtract(history, 'days').unix();
            showWeatherByDate(latLong, theDate,callback);
            history++;
        }
    }
    //if endDate == 0, then start date is future
    if (endDiff === 0) {
        for (var i = 0; i < (startDiffDays+2); i++) {
            theDate = moment().add(future, 'days').unix();
            showWeatherByDate(latLong, theDate, callback);
            future++;
        }
    }
    //if stardate & enddate > 0, then dates are future
    if (startDiff > 0 && endDiff > 0) {
        future = Math.ceil(endDiff / 24);
        for (var i = 0; i < startDiffDays; i++) {
            theDate = moment().add(future, 'days').unix();
            showWeatherByDate(latLong, theDate, callback);
            future++;
        }
    }
    //if stardate & enddate < 0, then dates are history
    if (startDiff < 0 && endDiff < 0) {
        history = startDiffDays;
        for (var i = 0; i < (endDiffDays * -1); i++) {
            theDate = moment().subtract(history, 'days').unix();
            showWeatherByDate(latLong, theDate,callback);
            history++;
        }
    }
}

//function to show weather information by date
function showWeatherByDate(latLong, theDate, callback) {
    var results = [];
    var lat = 32.8531813;
    var long = -117.1826385;
    if (latLong) { lat = latLong[0]; long = latLong[1]; }

    var apiKey = "8692514483fc6517f978c21cd04dae3b";
    var queryURL = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/" + apiKey + "/" + lat + "," + long + "," + theDate + "?units=us&exclude=minutely,hourly";
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var idx = moment.unix(response.daily.data[0].time).format("YYYY-MM-DD");
        console.log(idx);
        results[idx] = {
            unixTime: moment(idx).format('X'),
            date: idx,
            tempMax: response.daily.data[0].temperatureMax,
            tempMin: response.daily.data[0].temperatureMin,
            cloudCover: response.daily.data[0].cloudCover,
            humidity: response.daily.data[0].cloudCover,
            summary: response.daily.data[0].summary,
            icon: response.daily.data[0].icon,
            pressure: response.daily.data[0].pressure,
            windSpeed: response.daily.data[0].windSpeed,
        };
        //check dates if today or less than today or greater than today then push to results
        callback(results);
    });
}

//function to show weather information for 7 days forecast
function showWeatherFuture(latLong, callback) {
    var results = [];
    var future = 0;
    var history = 0;
    var theDate = moment().unix();
    var lat = 32.8531813;
    var long = -117.1826385;
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
                humidity: response.daily.data[0].cloudCover,
                summary: response.daily.data[0].summary,
                icon: response.daily.data[0].icon,
                pressure: response.daily.data[0].pressure,
                windSpeed: response.daily.data[0].windSpeed
            };
            callback(results);
        });
    }
}
//function to show weather information for previous 1 month
function showWeatherHistory(latLong, callback) {
    var results = [];
    var future = 7;
    var history = 1;
    var theDate = moment().unix();
    var lat = 32.8531813;
    var long = -117.1826385;
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
                humidity: response.daily.data[0].cloudCover,
                summary: response.daily.data[0].summary,
                icon: response.daily.data[0].icon,
                pressure: response.daily.data[0].pressure,
                windSpeed: response.daily.data[0].windSpeed
            };
            callback(results);
        });
    }
}
//START - Dark Sky API