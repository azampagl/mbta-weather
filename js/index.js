// MAKE CHART GLOBAL FOR NOW FOR DEBUGGING.
var chart;

(function() {

  /**
   *
   */
  var init = function(timelineSummary, stationSummaries, stationSeries) {
    // Generate an event hanlder to share between the modules.
    var eventHandler = new Object();

    var timeline = new Timeline(
      {
        parent: '#timeline-container',
        chart: '#timeline',
      },
      timelineSummary,
      eventHandler
    );
    timeline.init();

    var map = new Map('map', stationSummaries, eventHandler);
    map.init();

    var chartElements = {
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
      height: 270,
      width: d3.select(chartElements.parent)[0][0].clientWidth,
      title: {
        height: 30,
      },
      x_axis: {
        height: 25,
      },
      x_axis_title: {
        height: 25,
      },
      y_axis: {
        width: 80,
      },
    };

    chart = new Chart(chartElements, chartOptions, stationSeries, eventHandler);
    chart.init(1052, 0);

    var summary = new Summary({
      root: 'summary',
      snow_slider: 'snow-slider',
    },
    stationSummaries, eventHandler);

    summary.init();
  };

  // Load in our data sets and call the init function when ready.
  //queue()
  //  .defer(d3.json, 'processing/station_summary.json')
  //  .defer(d3.json, 'processing/station_series.json')
  //  .await(init);
  d3.json('processing/full_summary.json', function(timelineSummary) {
    d3.json('processing/station_summary.json', function(stationSummaries) {
      d3.json('processing/station_series.json', function(stationSeries) {
        init(timelineSummary, stationSummaries, stationSeries);
      });
    });
  });

})();
