//Firebase database for storing the solar array
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAa4-IM45gdB6fcd3hJTZdLdTmX_CqCX6Y",
    authDomain: "solar-predictor.firebaseapp.com",
    databaseURL: "https://solar-predictor.firebaseio.com",
    projectId: "solar-predictor",
    storageBucket: "solar-predictor.appspot.com",
    messagingSenderId: "92146297740"
};
firebase.initializeApp(config);

var database = firebase.database();
var solarArrayId = "";

//Required with Bootstrap for the popover on the weather to work
$(function () {
    $('[data-toggle="popover"]').popover()
})

//all inital loading in here
$(document).ready(function () {

    //startUp();
    getWeatherAndEnergyHist(undefined, undefined, undefined, function() {
        console.log("Reached callback");
    });

    function startUp() {
        //Show the status 
        $("#solarTable").css("display", "none");
        $("#solarChart").css("display", "none");
        $("#startUp").css("display", "block");

        //Get solar array id
        $("#startUpP").text('Getting solar array ID...');
        getSolarArrayId(function (solarArrayId2) {
            solarArrayId = solarArrayId2;

            if (solarArrayId === "") {
                $("#startUpP").text('Before we can predict your solar output, you need to enter your Solar ID.  Please the "Solar ID" menu option above to begin.');
            } else {
                $("#startUpP").text('Getting energy predictions...');
                getWeatherAndEnergyHist(solarArrayId, undefined, undefined, function(worked) {

                    dataReady = worked;

                    console.log("show table!");
                    $("#solarTable").css("display", "block");
                    $("#solarChart").css("display", "none");
                    $("#startUp").css("display", "none");
                    google.load("visualization", "1", { packages: ["corechart"] });
                });
            }
        });

    }


    function getSolarArrayId(callback) {
        var solarArrayId2 = "";

        database.ref().once('value', function (snapshot) {
            if (snapshot.hasChild("solarArrayId")) {
                solarArrayId2 = snapshot.val().solarArrayId;
            }
            callback(solarArrayId2);
        }, function (errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });  
    }



    $('#yourId').on('shown.bs.modal', function () {
        //Puts focus on the solor ID input field
        $('#solarId').focus();

        var solarArrayId = getSolarArrayId(function (solarArrayId2) {
            $('#solarId').val(solarArrayId2);
        });

    })


    $(document).on("click", "#menuTableChart", function () {
        // console.log($(this).text());

        if ($(this).text() === "Chart") {
            $(this).text("Table");
            $("#solarTable").css("display", "none")
            $("#solarChart").css("display", "block")
        } else {
            $(this).text("Chart");
            drawChart1();
            $("#solarChart").css("display", "none")
            $("#solarTable").css("display", "block")
        }
    })




    //Save Solar ID
    $("#solar-form").on("submit", function (e) {
        e.preventDefault();

        var newSolarArrayId = $("#solarId").val();

        if (newSolarArrayId != solarArrayId) {      //new ID, get data again
            solarArrayId = newSolarArrayId;
            startUp();
        }


        database.ref().once('value', function (snapshot) {

            if (snapshot.hasChild("solarId")) {
                database.ref().update({
                    solarArrayId: solarArrayId
                })
            } else {
                database.ref().set({
                    solarArrayId: solarArrayId
                })
            }
        }, function (errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });

        $('#yourId').modal('toggle');
    });


    //Charting...


    // google.setOnLoadCallback(drawChart1);

    function drawChart1() {

        var tempData = [];
        var color = '#A9635E';
        tempData.push(['Date', 'Power', { role: 'style' }]);
        for (var i = 0; i < gsolarData.length; i++) {

            var solarDate = new Date(moment.utc(gsolarData[i].date));

            if (solarDate > moment()) {		//If in the future make the color of the bar red
                color = '#A9635E'			//same color as our logo
            } else {
                color = '#E6E6FA'			//matches header
            }
            tempData.push([solarDate, gsolarData[i].powerGenerated, color])
        }

        var data = google.visualization.arrayToDataTable(tempData);

        var options = {
            hAxis: { title: 'Day', format: 'M/d' },
            vAxis: { title: 'kWh', format: 'short' },
            legend: { position: 'none' }
        };

        var chart = new google.visualization.ColumnChart(document.getElementById('solarChartDiv'));
        chart.draw(data, options);
    }


    $(window).resize(function () {
        if (dataReady) {
            drawChart1();
        }
    })

    //end charting...






})




// var EndDate = moment().format();
// var StartDate = moment(EndDate).subtract(14, "days");
// console.log("StartDate = " + StartDate + " EndDate = " + EndDate);

// getProductionHistory("961882", moment(StartDate).unix(), moment(EndDate).unix(), function(solarData) {

//     // getProductionHistory("961882", 1546329600, 1552032000, function(solarData) {
//     console.log("From getProductionHistory callback ");
//     console.log(solarData);
//     gsolarData = solarData;

//     // google.charts.load('current', {'packages':['corechart']});     

//     // google.charts.setOnLoadCallback(drawChart);



// });

