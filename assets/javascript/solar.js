
// SOLAR API
// This component uses the SolarEdge API - https://www.solaredge.com/sites/default/files/se_monitoring_api.pdf
//


var apiKey = "Z9OV01B8GW40QM4DE8N1NM11M33S83MG";

function buildURL(siteID, command) {

    var rslt = "https://cors-anywhere.herokuapp.com/https://monitoringapi.solaredge.com/site/" + siteID + "/" + command + "api_key=" + apiKey;
    //console.log(rslt);
    return rslt;
}


// GET SITE INFORMATION
// -------------------------------------------------------------------------------------------
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

        //console.log(response);
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
      
              //console.log(response);
      
              rslt.lastUpdateTime =  response.overview.lastUpdateTime;
              rslt.currentPower   =  response.overview.currentPower.power;

              //console.log(rslt);

              callback(rslt);
          });
    });
}


// GET PRODUCTION HISTORY
// -------------------------------------------------------------------------------------------
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

       // console.log(response);

        for(let i=0; i<response.energy.values.length; i++)
        {
            var datestr = response.energy.values[i].date;
            datestr = datestr.replace(" 00:00:00", "");

            var dateUnix = moment(datestr).format('X');

            rslt.push( {  date : datestr,
                        dateUnix : dateUnix,
                        powerGenerated : response.energy.values[i].value });

        }
        //console.log("From ajax call " + rslt);
        callback(rslt);
        
    }); 

}
