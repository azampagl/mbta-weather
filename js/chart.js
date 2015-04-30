/**
 * Constructor
 *
 * @param elements The HTML elements to attach too.
 * @param options The raw options to use.
 * @param data The data that contains the station summaries.
 * @param eventHandler The event handler shared between all views.
 */
Chart = function(elements, options, data, eventHandler) {
  var root = this;

  root.elements = elements;
  root.options = options;
  root.data = root.filterData(data);
  root.eventHandler = $(eventHandler);

  // Series data is the the rickshaw library.
  root.seriesData = [[], []];
  root.graph = null;
  root.legend = null;

  // Default the selection to weekday with no snow or rain selected.
  root.selectedStationId = null;
  root.selectedWeekTime = 'weekday';
  root.selectedSnowId = -1;
  root.selectedRainId = -1;

  // Listen for a station change event.
  root.eventHandler.on("stationChange", function(e, id) {
    root.stationChange(id);
  });

  // Listen for a control change event.
  root.eventHandler.on("controlChange", function(e, weekTime, weatherId, weatherAmountId) {
    root.controlChange(weekTime, weatherId, weatherAmountId);
  });
};

/**
 * Fiters the raw data so it can be used by the charting library.
 *
 * @param The raw data
 *
 * @return The filtered data.
 */
Chart.prototype.filterData = function(data) {
  filteredData = {};

  // The keys used in the original data set to designate each bin.
  var snow_keys = ['0', '0_2', '2_4', '4_8', '8_15', '15'];
  var rain_keys = ['drizzle', 'rain_no_drizzle'];

  // The lines on the map... We need to add these manually since we will
  //   be aggregating in JavaScript.
  var lines = {
    "Red": "Red Line",
    "Blue": "Blue Line",
    "Green": "Green Line",
    "Orange": "Orange Line",
  };

  // Get the size of all the bins.
  var num_time_intervals = data[0].time_intervals.length;
  var num_snow_bins = Object.keys(data[0]['weekday']['snow'].mean_ent_snow).length;
  var num_rain_bins = Object.keys(data[0]['weekday']['rain'].mean_ent_rain).length;

  // Initalize the the data set for each line.
  for (var key in lines) {
    // Find the line name.
    var line = lines[key];

    // Add the line to the filtered data structure.
    filteredData[line] = {
      name: line,
      x: data[0].time_intervals.slice(),
      y: {}
    };

    // Add the base time interval for the weekdays and weekends.
    filteredData[line].y.weekday = {};

    filteredData[line].y.weekday.snow = {};
    filteredData[line].y.weekday.snow.base = [];
    filteredData[line].y.weekday.snow.bins = [];

    filteredData[line].y.weekday.rain = {};
    filteredData[line].y.weekday.rain.base = [];
    filteredData[line].y.weekday.rain.bins = [];

    filteredData[line].y.weekend = {};

    filteredData[line].y.weekend.snow = {};
    filteredData[line].y.weekend.snow.base = [];
    filteredData[line].y.weekend.snow.bins = [];

    filteredData[line].y.weekend.rain = {};
    filteredData[line].y.weekend.rain.base = [];
    filteredData[line].y.weekend.rain.bins = [];

    // Initialize base y values..
    for (var i = 0; i < num_time_intervals; i++) {
      filteredData[line].y.weekday.rain.base.push(0.0);
      filteredData[line].y.weekday.snow.base.push(0.0);
      filteredData[line].y.weekend.rain.base.push(0.0);
      filteredData[line].y.weekend.snow.base.push(0.0);
    }

    // Populate the y snow bins.
    for (var i = 0; i < num_snow_bins; i++) {
      filteredData[line].y.weekday.snow.bins[i] = [];
      filteredData[line].y.weekend.snow.bins[i] = [];
      for (var j = 0; j < num_time_intervals; j++) {
        filteredData[line].y.weekday.snow.bins[i].push(0.0);
        filteredData[line].y.weekend.snow.bins[i].push(0.0);
      }
    }

    // Populate the rain bins.
    for (var i = 0; i < num_rain_bins; i++) {
      filteredData[line].y.weekday.rain.bins[i] = [];
      filteredData[line].y.weekend.rain.bins[i] = [];
      for (var j = 0; j < num_time_intervals; j++) {
        filteredData[line].y.weekday.rain.bins[i].push(0.0);
        filteredData[line].y.weekend.rain.bins[i].push(0.0);
      }
    }
  }

  data.forEach(function(d) {
    var sid = d.station_id;

    // Construct data set for this station.
    filteredData[sid] = {
      name: d.station_name,
      x: d.time_intervals,
      y: {
        weekday: {
          rain: {
            base: d.weekday.rain.mean_ent,
            bins: []
          },
          snow: {
            base: d.weekday.snow.mean_ent,
            bins: []
          }
        },
        weekend: {
          rain: {
            base: d.weekend.rain.mean_ent,
            bins: []
          },
          snow: {
            base: d.weekend.snow.mean_ent,
            bins: []
          }
        },
      },
    };

    // Populate snow days.
    snow_keys.forEach(function(key) {
      filteredData[sid].y.weekday.snow.bins.push(d.weekday.snow.mean_ent_snow[key]);
      filteredData[sid].y.weekend.snow.bins.push(d.weekend.snow.mean_ent_snow[key]);
    });

    // Populate rain days.
    rain_keys.forEach(function(key) {
      filteredData[sid].y.weekday.rain.bins.push(d.weekday.rain.mean_ent_rain[key]);
      filteredData[sid].y.weekend.rain.bins.push(d.weekend.rain.mean_ent_rain[key]);
    });

    // Increment the counts for each line for this station.
    d.line.forEach(function(line) {
      // Get the line key.
      var key = lines[line];

      // Agg base fields.
      for (var i = 0; i < num_time_intervals; i++) {
        filteredData[key].y.weekday.rain.base[i] += d.weekday.rain.mean_ent[i];
        filteredData[key].y.weekday.snow.base[i] += d.weekday.snow.mean_ent[i];
        filteredData[key].y.weekend.rain.base[i] += d.weekend.rain.mean_ent[i];
        filteredData[key].y.weekend.snow.base[i] += d.weekend.snow.mean_ent[i];

        // Agg snow
        for (var j = 0; j < num_snow_bins; j++) {
          filteredData[key].y.weekday.snow.bins[j][i] += filteredData[sid].y.weekday.snow.bins[j][i];
          filteredData[key].y.weekend.snow.bins[j][i] += filteredData[sid].y.weekend.snow.bins[j][i];
        }

        // Agg rain
        for (var j = 0; j < num_rain_bins; j++) {
          filteredData[key].y.weekday.rain.bins[j][i] += filteredData[sid].y.weekday.rain.bins[j][i];
          filteredData[key].y.weekend.rain.bins[j][i] += filteredData[sid].y.weekend.rain.bins[j][i];
        }
      }
    });
  });

  return filteredData;
};

/**
 * Initializes the chart.
 *
 * @param stationId the station id to initialize the chart on.
 */
Chart.prototype.init = function(stationId) {
  var root = this;

  d3.select(root.elements.parent)
    .style("position", "relative")
    .style("height", root.options.height + "px");

  d3.select(root.elements.x_axis_title)
    .style("position", "absolute")
    .style("top", "0")
    .style("bottom", "0")
    .style("height", root.options.x_axis.height + "px")
    .style("width", root.options.width + root.options.y_axis.width + "px")
    .style("text-align", "center")
    .style("font-size", "12px")
    .text("Time");

  d3.select(root.elements.y_axis_title)
    .style("position", "absolute")
    .style("top", "0")
    .style("bottom", "0")
    .style("width", root.options.height + "px")
    .style("text-align", "center")
    .style("-ms-transform", "rotate(-90deg)")
    .style("-webkit-transform", "rotate(-90deg)")
    .style("transform", "rotate(-90deg)")
    .style("text-align", "center")
    .style("font-size", "12px")
    .text("Entries (per Hour)");

  d3.select(root.elements.graph)
    .style("position", "absolute")
    .style("top", "0")
    .style("bottom", "0")
    .style("left", root.options.y_axis.width + "px")
    .style("width", root.options.width - root.options.y_axis.width + "px");

  d3.select(root.elements.y_axis)
    .style("position", "absolute")
    .style("top", "0")
    .style("bottom", "0")
    .style("left", "0")
    .style("width", root.options.y_axis.width + "px");

  // Create the rickshaw graph.
  root.graph = new Rickshaw.Graph({
    element: d3.select(root.elements.graph).node(),
    renderer: 'line',
    height: root.options.height - root.options.title.height - root.options.x_axis.height - root.options.x_axis_title.height,
    series: [
      {
        color: '#005CE6',
        data: root.seriesData[1],
        name: 'Snow Entries'
      },
      {
        color: '#000',
        data: root.seriesData[0],
        name: 'Normal Entries'
      },]
  });

  // Add the time format.
  var timeFormat = function(d) {
    var hours = Math.floor(d);
    var minutes = (d - hours) * 60;
    var ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    return hours + " " + ampm;
  };

  var xAxis = new Rickshaw.Graph.Axis.X({
    graph: root.graph,
    tickFormat: timeFormat,
    ticks: 10,
  });

  var yAxis = new Rickshaw.Graph.Axis.Y({
    graph: root.graph,
    orientation: 'left',
    tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
    ticks: 10,
    element: d3.select(root.elements.y_axis).node(),
  });

  root.legend = new Rickshaw.Graph.Legend({
    graph: root.graph,
    element: d3.select(root.elements.legend).node(),
  });

  var hoverDetail = new Rickshaw.Graph.HoverDetail({
    graph: root.graph,
    xFormatter: timeFormat,
    formatter: function(series, x, y) {
      var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
      var content = swatch + series.name + ": " + parseInt(y);
      return content;
    }
  });

  var highlight = new Rickshaw.Graph.Behavior.Series.Highlight({
    graph: root.graph,
    legend: root.legend
  });

  root.selectedStationId = stationId;
  root.updateDisplayData();

  root.render();
};

/**
 *
 */
Chart.prototype.render = function() {
  var root = this;

  this.graph.render();


  d3.select(root.elements.x_axis_title)
    .style("top", root.options.height - root.options.x_axis_title.height + "px");

  d3.select(root.elements.graph)
    .style("top", root.options.title.height + "px");

  d3.select(root.elements.y_axis)
    .style("top", root.options.title.height + "px");

  d3.select(root.elements.graph + " > svg")
    .style("top", "100px")
    .attr("height", root.options.height - root.options.title.height - root.options.x_axis_title.height);

  d3.selectAll(root.elements.graph + " > svg > g.x_ticks_d3.plain g > text")
    .style("font-family", "Lato,Helvetica Neue,Helvetica,Arial,sans-serif")
    .style("font-size", "11px")
    .attr("transform", "translate(5, " + root.options.x_axis.height + ")");
}

/**
 * Callback for when the user changes a control.
 *
 * @param weekTime Either weekday or weekend.
 * @param snowId The slider id for the snow control
 * @param rainId The slider id for the rain control.
 */
Chart.prototype.controlChange = function(weekTime, snowId, rainId) {
  var root = this;

  root.selectedWeekTime = weekTime;
  root.selectedSnowId = snowId;
  root.selectedRainId = rainId;

  // Update the display.
  root.updateDisplayData();
  root.render();
};

/**
 * Callback when a new station is selected.
 */
Chart.prototype.stationChange = function(id) {
  var root = this;

  root.selectedStationId = id;

  // Updates the subtitle.
  $(root.elements.container_subtitle).html("Current Selection: <b>" + filteredData[id].name + "</b>");

  // Update the display.
  root.updateDisplayData();
  root.render();
};

/**
 * Updates the graph display.
 */
Chart.prototype.updateDisplayData = function() {
  var root = this;

  // Clear out the current series data.
  root.seriesData[0].length = 0;
  root.seriesData[1].length = 0;

  // Defaults the legend text and display.
  root.graph.series[1].name = "Normal Entries";
  root.graph.series[0].name = "Rain Entries";
  $(root.elements.legend).css('display', 'none');

  var station = root.data[root.selectedStationId];

  var y_weather = null;
  if (root.selectedSnowId > -1 || root.selectedRainId > -1) {
    if (root.selectedSnowId > -1) {
      y_weather = station.y[root.selectedWeekTime].snow.bins[root.selectedSnowId];
      root.graph.series[1].name = "Normal Entries (Seasonal)";
      root.graph.series[0].name = "Snow Entries";
    }
    else {
      y_weather = station.y[root.selectedWeekTime].rain.bins[root.selectedRainId];
    }
    $(root.elements.legend).css('display', 'block');
  }

  for (var i = 0; i < station.x.length; i++) {
    var x = station.x[i];

    // Rain is the default base.
    var y_base = station.y[root.selectedWeekTime].rain.base[i];
    if (root.selectedSnowId > -1) {
      y_base = station.y[root.selectedWeekTime].snow.base[i]
    }

    // Set the base entries.
    root.seriesData[0].push({x: x, y: y_base});

    // Show weather only if one of the sliders are active.
    if (y_weather) {
      root.seriesData[1].push({x: x, y: y_weather[i]});
    }
  }

  root.legend.render();
};
