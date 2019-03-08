



var apiKey = "Z9OV01B8GW40QM4DE8N1NM11M33S83MG";
var siteID = "961882";


function buildURL(folder) {

  //   var rslt = "https://cors-anywhere.herokuapp.com/https://monitoringapi.solaredge.com/site/" + siteID + "/details?api_key=" + apiKey;
    var rslt = "https://cors-anywhere.herokuapp.com/https://monitoringapi.solaredge.com/site/" + siteID + "/" + folder + "?api_key=" + apiKey;


  
    console.log(rslt);
    return rslt;
}



function getSiteInfo() {

    var queryURL = buildURL("details");
    var rslt = {
        zip:"",
        lastUpdateTime:0,
        currentPower:0
    };

    // ------------------  Get the site details
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {  

        console.log(response);
        rslt.zip = response.details.location.zip;


        // ------------------  Get the site overview
        queryURL = buildURL("overview");   
        $.ajax({
            url: queryURL,
            method: "GET"
          }).then(function(response) {  
      
              console.log(response);
      
              rslt.lastUpdateTime =  response.overview.lastUpdateTime;
              rslt.currentPower   =  response.overview.currentPower.power;

              console.log(rslt);

              return rslt;
          });
    });
}
