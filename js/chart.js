/**
 *
 */

/**
 *
 */
Chart = function(graphElement, yAxisElement, eventHandler) {

  this.graphElement = graphElement;
  this.yAxisElement = yAxisElement;
  this.eventHandler = eventHandler;

};

/**
 *
 */
Chart.prototype.init = function() {
   var root = this;

   var seriesData = [ [], [], [], [], [], [], [], [], [] ];
   var random = new Rickshaw.Fixtures.RandomData(150);

   for (var i = 0; i < 150; i++) {
     random.addData(seriesData);
   }

   var palette = new Rickshaw.Color.Palette( { scheme: 'classic9' } );

   var graph = new Rickshaw.Graph( {
           element: document.getElementById(root.graphElement),
           renderer: 'line',
           height: 250,
           series: [ {
         			color: palette.color(),
         			data: seriesData[0],
         			name: 'Moscow'
         		}, {
         			color: palette.color(),
         			data: seriesData[1],
         			name: 'Shanghai'
         		}, {
         			color: palette.color(),
         			data: seriesData[2],
         			name: 'Amsterdam'
         		}, {
         			color: palette.color(),
         			data: seriesData[3],
         			name: 'Paris'
         		}, {
         			color: palette.color(),
         			data: seriesData[4],
         			name: 'Tokyo'
         		}
           ]
   });

   var hoverDetail = new Rickshaw.Graph.HoverDetail({
     graph: graph,
     xFormatter: function(x) {
       return new Date(x * 1000).toString();
     }
   });

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



   var xAxis = new Rickshaw.Graph.Axis.Time({ graph: graph });

   var yAxis = new Rickshaw.Graph.Axis.Y({
     graph: graph,
     orientation: 'left',
     tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
     element: document.getElementById(root.yAxisElement),
   });

   //console.log(d3.select("#chart-snow-y-axis svg").node())


   graph.render();

   /*d3.select("#chart-snow-y-axis svg")
     .append("g")
     .text("Entries")
     //.attr("text-anchor", "end")
     .attr("x", 0)
     .attr("y", 0)
     //.attr("dy", ".75em")
     .attr("transform", "rotate(-90)");*/

};
