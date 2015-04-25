/**
 *
 */

/**
 *
 */
Timeline = function(elements, data, eventHandler) {
  var root = this;

  this.elements = elements;
  this.data = data;
  this.eventHandler = $(eventHandler);

  this.controlKeys = {
    "snow": ['snow', 'snow_02', 'snow_24', 'snow_48', 'snow_815', 'snow_15'],
  };

  root.eventHandler.on("snowAmountChange", function(e, id) {
    root.snowAmountChange(id);
  });
};

/**
 *
 */
Timeline.prototype.displayData = function(data) {
  var root = this;

  var filteredData = [];

  //console.log(root.data);

  for (var i = 0; i < root.data['days'].length; i++) {
    //console.log(data['days'][i]);
    //console.log();
    //console.log(data['entries'][i]);
    //break;
    filteredData.push({x: new Date(root.data['days'][i].split("T")[0]), y: root.data['entries'][i]});
  }

  /*filteredData = [
    ,
    {x: new Date("July 30, 2013 00:00:00"), y: 7.24063492063492},
    {x: new Date("March 1, 2014 00:00:00"), y: 7.040566893424036},
    {x: new Date("February 20, 2015 00:00:00"), y: 8.340566893424036},
  ];*/

  return filteredData;
};

/**
 *
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
    .attr("x", function(d) { return x(d.x) - 3; })
    .attr("width", 7)
    .attr("opacity", 0.0)
    .attr("y", function(d) { return 0; })
    .attr("height", function(d) { return height; });
};

/**
 *
 */
Timeline.prototype.snowAmountChange = function(id) {
  var root = this;

  d3.select(root.elements.chart).selectAll(".bar")
    .attr("opacity", function(d, i) {
      if (root.data[root.controlKeys["snow"][id]][i]) {
        return 0.1;
      }
      return 0.0;
    });
};
