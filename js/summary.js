/**
 *
 */

/**
 *
 */
Summary = function(elements, stations, eventHandler) {

  this.elements = elements;
  this.stations = stations;
  this.eventHandler = $(eventHandler);

};

/**
 *
 */
Summary.prototype.init = function() {
  var root = this;

  // Initialize the snow amount slider.
  $("#" + root.elements.snow_slider).slider({
    handle: 'custom',
    ticks: [0, 1, 2, 3, 4, 5],
    ticks_labels: ['0', '0-2', '2-4', '4-8', '8-15', '15+'],
    ticks_snap_bounds: 1,
    tooltip: 'hide',
    value: 0
  });

  // When the slider value changes, trigger a global event.
  $("#" + root.elements.snow_slider).on("slideStop", function(e) {
    root.eventHandler.trigger("snowAmountChange", [e.value]);
  });
};
