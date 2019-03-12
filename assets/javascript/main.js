 
getSiteInfo("961882", function(siteInfo) {

    console.log("From getSiteInfo callback"); 
    console.log(siteInfo);
}); 



// Unix Date Jan 1, 2019 : 1546329600
// Unix date Feb 8, 2019 : 1552032000
// 



var EndDate = moment().format();
var StartDate = moment(EndDate).subtract(14, "days");
console.log("StartDate = " + StartDate + " EndDate = " + EndDate);

getProductionHistory("961882", moment(StartDate).unix(), moment(EndDate).unix(), function(solarData) {

    // getProductionHistory("961882", 1546329600, 1552032000, function(solarData) {
    console.log("From getProductionHistory callback ");
    console.log(solarData);
    gsolarData = solarData;

    // google.charts.load('current', {'packages':['corechart']});     
    
    // google.charts.setOnLoadCallback(drawChart);

    

});

