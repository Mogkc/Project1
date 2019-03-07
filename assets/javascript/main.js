



var apiKey = "Z9OV01B8GW40QM4DE8N1NM11M33S83MG";
var siteID = "961882";


function buildURL() {
    

    var rslt = "https://monitoringapi.solaredge.com/site/" + siteID + "/details?api_key=" + apiKey;

    return rslt;
}



function GetSolarInfo() {

    var queryURL = buildURL();
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {

        console.log(response);
    });

}


GetSolarInfo();
