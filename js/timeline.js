/**
 *
 */

/**
 *
 */
Timeline = function(elements, data, eventHandler) {

  this.elements = elements;
  this.data = this.filterData(data);
  this.eventHandler = $(eventHandler);

};

/**
 *
 */
Timeline.prototype.filterData = function(data) {
  filteredData = {};

  filteredData = [
    {x: new Date("January 1, 2013 00:00:00"), y: 6.281247165532879},
    {x: new Date("July 30, 2013 00:00:00"), y: 7.24063492063492},
    {x: new Date("March 1, 2014 00:00:00"), y: 7.040566893424036},
    {x: new Date("February 20, 2015 00:00:00"), y: 8.340566893424036},
  ];

  return filteredData;
};

/**
 *
 */
Timeline.prototype.init = function() {
  var root = this;

  var margin = {top: 20.5, right: 10, bottom: 30, left: 30.5};
  var width = $(root.elements.chart).parent().width() - margin.left - margin.right;
  var height = 250 - margin.top - margin.bottom;

  var x = d3.time.scale()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var line = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

  x.domain(d3.extent(root.data, function(d) { return d.x; }));
  y.domain(d3.extent(root.data, function(d) { return d.y; }));

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
    .attr("y", 6)
    .attr("dy", ".71em")
    .text("Value");

  svg.append("path")
    .datum(root.data)
    .attr("class", "line")
    .attr("d", line);

  svg.selectAll(".bar")
    .data(root.data)
  .enter()
  .append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.x); })
    .attr("width", 1)
    .attr("y", function(d) { return y(d.y); })
    .attr("height", function(d) { return height - y(d.y); });
};
