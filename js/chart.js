/**
 *
 */

/**
 *
 */
Chart = function(elements, options, data, eventHandler) {
  var root = this;

  root.elements = elements;
  root.options = options;
  root.data = root.filterData(data);
  root.eventHandler = $(eventHandler);

  root.seriesData = [[], []];
  root.graph = null;

  root.selectedStationId = null;
  root.selectedSnowAmountId = null;

  root.eventHandler.on("stationChange", function(e, id) {
    root.stationChange(id);
  });

  root.eventHandler.on("snowAmountChange", function(e, id) {
    root.snowAmountChange(id);
  });
};

Chart.prototype.filterData = function(data) {
  filteredData = {};

  //
  var keys = ['0', '0_2', '2_4', '4_8', '8_15', '15']

  data.forEach(function(d) {
    var weather = d['weekday']['snow'];

    //
    var y_snow = [];
    keys.forEach(function(key) {
      y_snow.push(weather.mean_ent_snow[key]);
    });

    //
    filteredData[d.station_id] = {
      name: d.station_name,
      x: d.time_intervals,
      y_base: weather.mean_ent,
      y_snow: y_snow
    }
  });

  return filteredData;
};

/**
 *
 */
Chart.prototype.init = function(stationId, snowAmountId) {
  var root = this;

  d3.select(root.elements.parent)
    .style("position", "relative")
    .style("height", root.options.height + "px");

  d3.select(root.elements.title)
    .style("position", "absolute")
    .style("top", "0")
    .style("bottom", "0")
    .style("height", root.options.title.height + "px")
    .style("width", root.options.width + root.options.y_axis.width + "px")
    .style("text-align", "center")
    .text("Average Hourly Entries for " + root.data[stationId].name)

  d3.select(root.elements.x_axis_title)
    .style("position", "absolute")
    .style("top", "0")
    .style("bottom", "0")
    .style("height", root.options.x_axis.height + "px")
    .style("width", root.options.width + root.options.y_axis.width + "px")
    .style("text-align", "center")
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
    .text("Entries");

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

  var timeFormat = function(d) {
    var hours = Math.floor(d);
    var minutes = (d - hours) * 60;
    var ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12;

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return hours + ":" + minutes + " " + ampm;
  };

  var xAxis = new Rickshaw.Graph.Axis.X({
    graph: root.graph,
    //orientation: 'top',
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

  var legend = new Rickshaw.Graph.Legend({
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
    legend: legend
  });

  root.selectedSnowAmountId = snowAmountId;
  root.selectedStationId = stationId;
  root.updateDisplayData();

  root.render();

   /*
   var seriesData = [ [], [], [], [], [], [], [], [], [] ];
   var random = new Rickshaw.Fixtures.RandomData(150);

   for (var i = 0; i < 150; i++) {
     random.addData(seriesData);
   }

   var palette = new Rickshaw.Color.Palette( { scheme: 'classic9' } );



   var hoverDetail = new Rickshaw.Graph.HoverDetail({
     graph: graph,
     xFormatter: function(x) {
       return new Date(x * 1000).toString();
     }
   });*/

   /*var annotator = new Rickshaw.Graph.Annotate({
     graph: graph,
     element: document.getElementById('timeline')
   });*/



   /*Rickshaw.Graph.Behavior.Series.Toggle.prototype.updateBehaviour = function() {
     console.log("hello");
   };

   console.log(Rickshaw.Graph.Behavior.Series.Toggle);*/

   /*Rickshaw.Graph.Renderer.DanielArea = Rickshaw.Class.create(
     Rickshaw.Graph.Behavior.Series.Toggle, {

     });*/
   //console.log(Rickshaw.Graph.Behavior.Series.Toggle.prototype);
   //console.log(Rickshaw.Graph.Behavior.Series.Toggle.updateBehaviour);
   /*Rickshaw.Graph.Behavior.Series.Toggle.prototype.print = function() {
     console.log("hello");
   }*/

   /*var shelving = new Rickshaw.Custom.LegendToggle({
     graph: graph,
     legend: legend
   });*/

   /**
    */
   //console.log(Rickshaw.Graph.Behavior.Series.Toggle);
   /*shelving._addBehavior = function() {
     console.log("hello");
   };*/
   //shelving.print();


/*

*/
   //console.log(d3.select("#chart-snow-y-axis svg").node())


//   graph.render();

   /*d3.select("#chart-snow-y-axis svg")
     .append("g")
     .text("Entries")
     //.attr("text-anchor", "end")
     .attr("x", 0)
     .attr("y", 0)
     //.attr("dy", ".75em")
     .attr("transform", "rotate(-90)");*/

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
    .attr("transform", "translate(5, " + root.options.x_axis.height + ")");
}

/**
 *
 */
Chart.prototype.snowAmountChange = function(id) {
  var root = this;

  root.selectedSnowAmountId = id;

  //
  root.updateDisplayData();
  root.render();
};

/**
 *
 */
Chart.prototype.stationChange = function(id) {
  var root = this;

  root.selectedStationId = id;

  //
  root.updateDisplayData();
  root.render();
};

/**
 *
 */
Chart.prototype.updateDisplayData = function() {
  var root = this;

  root.seriesData[0].length = 0;
  root.seriesData[1].length = 0;

  var station = root.data[root.selectedStationId];

  for (var i = 0; i < station.x.length; i++) {
    //
    root.seriesData[0].push({x: station.x[i], y: station.y_base[i]});
    //
    root.seriesData[1].push({x: station.x[i], y: station.y_snow[root.selectedSnowAmountId][i]});
  }
};
