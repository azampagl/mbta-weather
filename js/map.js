/**
 *
 */

/**
 *
 */
Map = function(element, stations, eventHandler) {

  this.element = element;
  this.stations = stations;
  this.eventHandler = $(eventHandler);

  this.eventHandler.on("snowAmountChange", this.snowAmountChange);
};

/**
 *
 */
Map.prototype.init = function() {
  var root = this;

  var mapOptions = {
    center: { lat: 42.3564545, lng: -71.0591312},
    zoom: 13
  };

  this.map = new google.maps.Map(document.getElementById(root.element), mapOptions);

};

/**
 *
 */
Map.prototype.snowAmountChange = function(e, index) {
  console.log("Map.snowAmountChange: " + index);
}
