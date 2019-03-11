
getSiteInfo("961882", function(siteInfo) {

    console.log("From getSiteInfo callback"); 
    console.log(siteInfo);
}); 



// Unix Date Jan 1, 2019 : 1546329600
// Unix date Feb 8, 2019 : 1552032000
// 
getProductionHistory("961882", 1546329600, 1552032000, function(solarData) {

    console.log("From getProductionHistory callback ");
    console.log(solarData);
});

