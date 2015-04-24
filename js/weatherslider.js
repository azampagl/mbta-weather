/**
 *
 */

/** Creates a weather slider object
 *   handleSymbol - character to use as slider 'handle' ie '\2744' for the unicode snowflake
 *   text - descriptive text that defines this slider to the userAgent
 *   sliderTicks - list of text objects - one for each tick (used for label)
 *   tickLabels - a label to augment the individual sliderTicks units or description
 *       (the value of the tick is the index to the label)
 *   eventName - the name of the event to trigger on slider changes
 *   eventHandler - the event handler object
 */
WeatherSlider = function(handleSymbol, text, sliderTicks, tickLabels, eventName, eventHandler) {
	this.eventHandler = $(eventHandler);
	
	// create the ticks value array - simply index of tickLabel
	var tickVals = new Array(tickLabel.length())
	var runner = 0;
	while(runner <= tickLabel.length()){
	   tickVals.push(runner++);
	}
	
	
	// Initialize the snow amount slider.
	$("#" + root.elements.snow_slider).slider({
		handle: 'custom',
		ticks: tickVals,
		ticks_labels: tickLabels,
		ticks_snap_bounds: 1,
		tooltip: 'hide',
		content: handleSymbol,
		value: 0
	});

	// When the slider value changes, trigger a global event.
	$("#" + root.elements.snow_slider).on("slideStop", function(e) {
		root.eventHandler.trigger(eventName, [e.value]);
	});
	
};

/**
 *
 */
Summary.prototype.enable = function(val) {
	var root = this;
	
	// only do the work if we need to change states
	if(val != root.enabled){
		root.enabled = val;
		if(val == true){
			// returning to enabled state
		}else{
			// going disabled
		}
	}
	
	
};
