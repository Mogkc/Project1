
var gsolarData;

google.load("visualization", "1", { packages: ["corechart"] });
// google.setOnLoadCallback(drawChart1);

function drawChart1() {

	// console.log(gsolarData);
	var data = new google.visualization.DataTable();
	data.addColumn('date', 'Date');
	data.addColumn('number', 'Power');
	for (var i = 0; i < gsolarData.length; i++) {
		
		var solarDate = new Date(moment.utc(gsolarData[i].date));


		// solarDate = gsolarData[i].date;
		console.log(solarDate);
		// console.log(gsolarData[i].date);

		data.addRows([
			[solarDate, gsolarData[i].powerGenerated]
		]);
	}
	
	var options = {
		title: 'Power Generation',
		hAxis: { title: 'Day', format: 'MM/d'}, 
		vAxis: { title: 'kWh', format: 'short'},
		legend: {position: 'none'}
	};


	var chart = new google.visualization.ColumnChart(document.getElementById('solarChart'));
	chart.draw(data, options);
}


$(window).resize(function () {
	drawChart1();
})

// // Load the Visualization API and the corechart package.
// //google.charts.load('current', {'packages':['corechart']});

// // Set a callback to run when the Google Visualization API is loaded.
// //google.charts.setOnLoadCallback(drawChart);

// // Callback that creates and populates a data table,
// // instantiates the pie chart, passes in the data and
// // draws it.
// function drawChart() {

// 	// Create the data table.
// 	var data = new google.visualization.DataTable();
// 	data.addColumn('string', 'Date');
// 	data.addColumn('number', 'Power');
// 	for (let i = 0; i < gsolarData.length; i++) {

// 		data.addRows([
// 			[gsolarData[i].date, gsolarData[i].powerGenerated]
// 		]);
// 	}

// 	console.log("googleized data = " + JSON.stringify(data));

// 	// Set chart options
// 	var options = {
// 		'title': 'Power Generation',
// 		'width': 1200,
// 		'height': 500,
// 		animation: { startup: true },
// 		hAxis: {
// 			format: 'd',
// 			showTextEvery: 3
// 		},
// 		vAxis: {
// 			format: 'short',
// 			title: "kWh"
// 		},
// 		legend: { position: "none" },
// 		// Color of the box outline.
// 		stroke: '#888',
// 		// Thickness of the box outline.
// 		strokeWidth: 1,
// 		// x-radius of the corner curvature.
// 		rx: 10,
// 		// y-radius of the corner curvature.
// 		ry: 10,
// 		// Attributes for linear gradient fill.
// 		gradient: {
// 			// Start color for gradient.
// 			color1: '#fbf6a7',
// 			// Finish color for gradient.
// 			color2: '#33b679',
// 			// Where on the boundary to start and
// 			// end the color1/color2 gradient,
// 			// relative to the upper left corner
// 			// of the boundary.
// 			x1: '0%', y1: '0%',
// 			x2: '100%', y2: '100%',
// 			// If true, the boundary for x1,
// 			// y1, x2, and y2 is the box. If
// 			// false, it's the entire chart.
// 			useObjectBoundingBoxUnits: true
// 		}
// 	}

// 	// Instantiate and draw our chart, passing in some options.
// 	// var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
// 	var chart = new google.visualization.ColumnChart(document.getElementById('solarChart'));


// 	//var visualization = new google.visualization.ColumnChart(container); 

// 	chart.draw(data, options);
// }


