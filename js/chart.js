/**
 *
 */

/**
 *
 */
Chart = function(elements, data, eventHandler) {
  var root = this;

  root.elements = elements;
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
    //
    var y_snow = [];
    keys.forEach(function(key) {
      y_snow.push(d.mean_ent_snow[key]);
    });

    //
    filteredData[d.station_id] = {
      name: d.station_name,
      x: d.time_intervals,
      y_base: d.mean_ent,
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

  var palette = new Rickshaw.Color.Palette( { scheme: 'classic9' } );

  //root.seriesData[0] = [];
  /*var station = root.data[this.selectedStation];
  for (var i = 0; i < station.x.length; i++) {
    root.seriesData[0].push({x: station.x[i], y: station.y_base[i]})
  }*/

  root.graph = new Rickshaw.Graph({
    element: document.getElementById(root.elements.graph),
    renderer: 'line',
    height: 250,
    series: [
      {
        color: '#000',
        data: root.seriesData[0],
        name: 'Normal Entries'
      },
      {
        color: '#005CE6',
        data: root.seriesData[1],
        name: 'Snow Entries'
      }]
  });



  /*var unit = {}
  unit.formatTime = function(d) {
    console.log(d);
    return d.toUTCString().match(/(\d+:\d+):/)[1];
  };
  unit.formatter = function(d) {
    return this.formatTime(d)
  };
  unit.name = "5 minute";
  unit.seconds = 300;

  var xAxis = new Rickshaw.Graph.Axis.Time({
    graph: root.graph,
    //timeUnit: unit,
    //timeFixture: new Rickshaw.Fixtures.Time.Local()
  });*/
  var x_axis = new Rickshaw.Graph.Axis.X({
    graph: root.graph,
    //orientation: 'top',
    tickFormat: function(d) {
      var hours = Math.floor(d);
      var minutes = (d - hours) * 60;
      var ampm = hours >= 12 ? 'pm' : 'am';

      hours = hours % 12;
      hours = hours ? hours : 12;

      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;

      return hours + ":" + minutes + " " + ampm;
    },
  });



  var yAxis = new Rickshaw.Graph.Axis.Y({
    graph: root.graph,
    orientation: 'left',
    tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
    ticks: 10,
    element: document.getElementById(root.elements.y_axis),
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

   /*var legend = new Rickshaw.Graph.Legend({
     graph: graph,
     element: document.getElementById('chart-snow-legend')
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

  d3.select("#chart > svg")
    .attr("height", 300);

  /*d3.select("#chart > svg > path.path")
    .attr("transform", "translate(30, 0)");

  d3.select("#chart > svg > g.x_grid_d3")
    .attr("transform", "translate(30, 0)");

  d3.select("#chart > svg > g.y_grid")
    .attr("transform", "translate(30, 0)");*/

  d3.selectAll("#chart > svg > g.x_ticks_d3.plain g > text")
    .attr("transform", "translate(5, 25)");
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
