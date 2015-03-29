(function() {

  var eventHandler = new Object();

  var map = new Map('map', eventHandler);
  map.init();

  var chart = new Chart('chart', 'chart-y-axis', eventHandler);
  chart.init();

})();
