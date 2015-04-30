/**
 * Timeline.
 *
 * @param elements The HTML elements for this view.
 * @param data The data used specifically by the timeline view.
 * @param eventHandler The global event handler.
 */
Timeline = function(elements, data, eventHandler) {
  var root = this;

  this.elements = elements;
  this.data = data;
  this.eventHandler = $(eventHandler);

  // These are the control keys in the data set to access each specific data set.
  this.controlKeys = {
    "snow": ['trace_snow', 'snow_02', 'snow_24', 'snow_48', 'snow_815', 'snow_15'],
    "rain": ['drizzle', 'rain_not_drizzle'],
  };

  root.eventHandler.on("controlChange", function(e, weekTime, snowId, rainId) {
    root.controlChange(weekTime, snowId, rainId);
  });
};

/**
 * Generates the display data used by the timeline.
 *
 * @param data The raw data from the json file.
 *
 * @return Filtered data.
 */
Timeline.prototype.displayData = function(data) {
  var root = this;

  var filteredData = [];

  // Add the x axis as time and the y axis as entries.
  for (var i = 0; i < root.data['days'].length; i++) {
    filteredData.push({x: new Date(root.data['days'][i].split("T")[0]), y: root.data['entries'][i]});
  }

  return filteredData;
};

/**
 * Init the timeline.
 */
Timeline.prototype.init = function() {
  var root = this;

  var data = root.displayData();

  var margin = {top: 15, right: 10, bottom: 20, left: 50};
  var width = $(root.elements.chart).parent().width() - margin.left - margin.right;
  var height = 100 - margin.top - margin.bottom;

  var x = d3.time.scale()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  x.domain(d3.extent(data, function(d) { return d.x; }));
  // Hard code the y domain scales this way it looks elegant.
  y.domain([200000, 500000]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickValues(y.domain())
    .tickFormat(d3.format(".2s"));

  var line = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

  var svg = d3.select(root.elements.chart)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("class", "title")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2 - 15)
    .attr("y", -10)
    .style("text-align", "center")
    .text("Entries");

  svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);

  svg.selectAll(".bar")
    .data(data)
  .enter()
  .append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.x) - 1; })
    .attr("width", 3)
    .attr("opacity", 0.0)
    .attr("y", function(d) { return 0; })
    .attr("height", function(d) { return height; });
};

/**
 * Callback for when the controls are changed.
 *
 * @param weekTime The current time of week selected (weekday/weektime).
 * @param snowId The current selected snow id.
 * @param rainId The current selected rainId.
 */
Timeline.prototype.controlChange = function(weekTime, snowId, rainId) {
  var root = this;

  var bars = d3.select(root.elements.chart).selectAll(".bar");

  var count = 0;
  bars.attr("opacity", function(d, i) {
    if (snowId > -1 && root.data[weekTime][root.controlKeys.snow[snowId]][i]) {
      count += 1;
      return 0.1;
    }
    if (rainId > -1 && root.data[weekTime][root.controlKeys.rain[rainId]][i]) {
      count += 1;
      return 0.1;
    }
    return 0.0;
  });

  // If neither snow or rain was selected, set the count to the full data set.
  if (snowId == -1 && rainId == -1 && count == 0) {
    count = 770;
  }

  $(root.elements.container_subtitle).html("Days in Selection: <b>" + count + "</b>");
};
