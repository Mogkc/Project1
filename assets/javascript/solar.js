// SOLAR API
// This component uses the SolarEdge API - https://www.solaredge.com/sites/default/files/se_monitoring_api.pdf

//Global variables that will hold relevant solar data
var gsolarData;
var dataReady = false;

var apiKey = "Z9OV01B8GW40QM4DE8N1NM11M33S83MG";

/**
 * Builds a url that can interface with the Solar API with ajax
 * @param {string} siteID The id of the location
 * @param {string} command The command to give to the API
 */
function buildURL(siteID, command) {
    var rslt = "https://cors-anywhere.herokuapp.com/https://monitoringapi.solaredge.com/site/" + siteID + "/" + command + "api_key=" + apiKey;
    return rslt;
}


/**
 * Gets the information for a particular location, and passes it to a callback function
 * @param {string} siteID The id of the location
 * @param {function} callback A function that recieves and uses the site info
 */
function getSiteInfo(siteID, callback) {

    var rslt = {
        zip:"",
        lastUpdateTime:0,
        currentPower:0
    };

    // ------------------  Get the site details
    var queryURL = buildURL(siteID, "details?");
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {  

        rslt.zip            =  response.details.location.zip;
        rslt.streetAddress  =  response.details.location.address;       
        rslt.streetState    =  response.details.location.state;     
        rslt.streetCity     =  response.details.location.city;     

        // ------------------  Get the site overview
        queryURL = buildURL(siteID, "overview?");   
        $.ajax({
            url: queryURL,
            method: "GET"
          }).then(function(response) {  
              rslt.lastUpdateTime =  response.overview.lastUpdateTime;
              rslt.currentPower   =  response.overview.currentPower.power;
          });
    });
}


/**
 * Gets the production history of a particular location over a date range
 * @param {string} siteID The ID of the location
 * @param {string} startDateUnix The unix code for the starting time
 * @param {string} endDateUnix The unix code for the end time
 * @param {function} callback A function that recieves and uses the result
 */
function getProductionHistory(siteID, startDateUnix, endDateUnix , callback) {

    var rslt = [];
    var singleDayInfo = {
        "date": "",
        "dateUnix" : "",
        "powerGenerated" : 0
    };

    // convert the unix dates to calendar string dates for SolarEdge API
    var startDateYMD = moment.unix(startDateUnix).format("YYYY-MM-DD");
    var endDateYMD   = moment.unix(endDateUnix).format("YYYY-MM-DD");
    // endDateYMD   = "2019-03-08";
    // startDateYMD = "2019-01-01";


    // ------------------  Get the production data
    var queryURL = buildURL(siteID, "energy?timeUnit=DAY&startDate=" + startDateYMD + "&endDate=" + endDateYMD + "&");
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {  

        for(let i=0; i<response.energy.values.length; i++)
        {
            var datestr = response.energy.values[i].date;
            datestr = datestr.replace(" 00:00:00", "");

            var dateUnix = moment(datestr).format('X');

            rslt.push( {  date : datestr,
                        dateUnix : dateUnix,
                        powerGenerated : response.energy.values[i].value });
        }

        callback(rslt);        
    }); 

}