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


//Required with Bootstrap for the toggle to work
$(function () {
    $('[data-toggle="popover"]').popover()
})

//Puts focus on the solor ID input field
$('#yourId').on('shown.bs.modal', function () {
    $('#solarId').focus();

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



