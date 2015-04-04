(function() {

  /**
   *
   */
  var init = function(error, stationSummaries, stationSeries) {
    console.log(error);
    console.log(stationSummaries);
    console.log(stationSeries);
    /*
    // Generate an event hanlder to share between the modules.
    var eventHandler = new Object();

    var map = new Map('map', stationSummaries, eventHandler);
    map.init();

    var chart = new Chart('chart', 'chart-y-axis', stationSeries, eventHandler);
    chart.init();

    var summary = new Summary({
        root: 'summary',
        snow_slider: 'snow-slider',
      },
      stationSummaries, eventHandler);
    summary.init();*/
  };

  // Load in our data sets and call the init function when ready.
  queue()
    .defer(d3.json, 'processing/station_summary.json')
    .defer(d3.json, 'processing/station_series.json')
    .await(init);

})();
