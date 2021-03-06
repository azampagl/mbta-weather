$(function() {

  // Load in our data sets asynchronously and call the init function when ready.
  queue().defer(d3.json, 'processing/full_summary.json')
	.defer(d3.json, 'processing/station_summary.json')
    .defer(d3.json, 'processing/station_series_scaled.json')
	.defer(d3.json, 'processing/station_map_numbers.json')
	.defer(d3.json, 'processing/station_map.json')
	.defer(d3.json, 'processing/line_blue.json')
	.defer(d3.json, 'processing/line_orange.json')
	.defer(d3.json, 'processing/line_green.json')
	.defer(d3.json, 'processing/line_greenB.json')
	.defer(d3.json, 'processing/line_greenC.json')
	.defer(d3.json, 'processing/line_greenD.json')
	.defer(d3.json, 'processing/line_greenE_underground.json')
	.defer(d3.json, 'processing/line_greenE.json')
	.defer(d3.json, 'processing/line_red.json')
	.defer(d3.json, 'processing/line_redB.json')
	.defer(d3.json, 'processing/line_redM.json')
    .await(init);

  // error should be "null" if no error
  function init(error, timelineSummary, stationSummaries, stationSeries, station_map_numbers, station_map, line_blue, line_orange, line_green,
					line_greenB, line_greenC, line_greenD, line_greenE_underground, line_greenE, line_red, line_redB, line_redM) {
    if (!error) {

		// Create an eventHandler
		var MyEventHandler = new Object();

		// Init map
		var subwayMap = new SubwayMap(d3.select("#subwaymap"), station_map, station_map_numbers, line_blue, line_orange, line_green, line_greenB, line_greenC, line_greenD, line_greenE_underground, line_greenE, line_red, line_redB, line_redM, MyEventHandler);

    // Init timeline.
		var timeline = new Timeline(
		  {
        container_subtitle: '#timeline-visual .visual-container-header-subtitle',
        parent: '#timeline-container',
        chart: '#timeline',
		  },
		  timelineSummary,
		  MyEventHandler
		);
		timeline.init();

    // Init chart.
		var chartElements = {
      container_subtitle: '#map-visual .visual-container-header-subtitle, #chart-visual .visual-container-header-subtitle',
		  parent: '#chart-container',
		  graph: '#chart',
		  title: '#chart-title',
		  legend: '#chart-legend',
		  y_axis: '#chart-y-axis',
		  x_axis: '#chart-x-axis',
		  y_axis_title: '#chart-y-axis-title',
		  x_axis_title: '#chart-x-axis-title',
		};
		var chartOptions = {
		  height: 250,
		  width: d3.select(chartElements.parent)[0][0].clientWidth - 20,
		  title: {
			     height: 30,
		  },
		  x_axis: {
			     height: 30,
		  },
		  x_axis_title: {
			     height: 30,
		  },
		  y_axis: {
			     width: 50,
		  },
		};
		var chart = new Chart(chartElements, chartOptions, stationSeries, MyEventHandler);
		chart.init(1052, 'snow'); // Start with harvard, of course!

    // Init controls.
		var controls = new Controls({
		  root: 'controls',
      week_selection: '#week-selection',
		  snow_slider: '#snow-slider',
      rain_slider: '#rain-slider',
		}, MyEventHandler);
    controls.init();
    }
  };
});
