// MAKE CHART GLOBAL FOR NOW FOR DEBUGGING.
var chart;

(function() {

  /**
   *
   */
  var init = function(stationSummaries, stationSeries) {
    // Generate an event hanlder to share between the modules.
    var eventHandler = new Object();

    var map = new Map('map', stationSummaries, eventHandler);
    map.init();

    //var chart = new Chart({
    chart = new Chart({
      graph: 'chart',
      y_axis: 'chart-y-axis',
    }, stationSeries, eventHandler);

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
  d3.json('/processing/station_summary.json', function(stationSummaries) {
    d3.json('/processing/station_series.json', function(stationSeries) {
      init(stationSummaries, stationSeries)
    });
  });

})();
