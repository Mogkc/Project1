
var gsolarData;

google.load("visualization", "1", { packages: ["corechart"] });
// google.setOnLoadCallback(drawChart1);

function drawChart1() {

	var tempData = [];
	var color = '#A9635E';
	tempData.push(['Date','Power',{role: 'style'}]);
	for (var i = 0; i < gsolarData.length; i++) {
		
		var solarDate = new Date(moment.utc(gsolarData[i].date));

		if (solarDate > moment()) {		//If in the future make the color of the bar red
			color = '#A9635E'			//same color as our logo
		} else {
			color = '#E6E6FA'			//matches header
		}
		tempData.push([solarDate,gsolarData[i].powerGenerated, color])
	}

	var data = google.visualization.arrayToDataTable(tempData);

	var options = {
		hAxis: { title: 'Day', format: 'M/d'}, 
		vAxis: { title: 'kWh', format: 'short'},
		legend: {position: 'none'}
	};

	var chart = new google.visualization.ColumnChart(document.getElementById('solarChartDiv'));
	chart.draw(data, options);
}


$(window).resize(function () {
	drawChart1();
})
