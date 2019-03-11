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
//Get initial solar array id from database
var solarArrayId = getSolarArrayId();




function getSolarArrayId () {
    var solarArrayId = "";

    database.ref().once('value', function (snapshot) {
        if (snapshot.hasChild("solarArrayId")) {
            solarArrayId = snapshot.val().solarArrayId;
        }
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    return(solarArrayId)
}


//Required with Bootstrap for the popover on the weather to work
$(function () {
    $('[data-toggle="popover"]').popover()
})

$(document).on("click", "#menuTableChart", function () {
    // console.log($(this).text());

    if ($(this).text() === "Chart") {
        $(this).text("Table");
        $("#solarTable").css("display","none")
        $("#solarChart").css("display","block")
    }  else {
        $(this).text("Chart");
        drawChart1();
        $("#solarChart").css("display","none")
        $("#solarTable").css("display","block") 
    }
})



$('#yourId').on('shown.bs.modal', function () {
    //Puts focus on the solor ID input field
    $('#solarId').focus();

    var solarArrayId = getSolarArrayId ();
    $('#solarId').val(solarArrayId);

    database.ref().once('value', function (snapshot) {
        if (snapshot.hasChild("solarArrayId")) {
            $('#solarId').val(snapshot.val().solarArrayId);
        }
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
})



//Save Solar ID
$("#solar-form").on("submit", function (e) {
    e.preventDefault();

    solarArrayId = $("#solarId").val();

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



