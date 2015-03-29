/**
 *
 */

/**
 *
 */
Map = function(element, eventHandler) {

  this.element = element;
  this.eventHandler = eventHandler;

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
