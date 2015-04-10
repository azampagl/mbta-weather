/**
 * subway map object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _stationGraph -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
SubwayMap = function(_parentElement, _data, _metaData){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.displayData = [];

    // define all constants
    this.margin = {top: 10, right: 10, bottom: 10, left: 10},
    var style = window.getComputedStyle(this.parentElement.node(), null);
	this.width = parseInt(style.getPropertyValue('width')) - this.margin.left - this.margin.right,
    this.height = 600 - this.margin.top - this.margin.bottom;

    this.init();
}

/**
 *
 */
SubwayMap.prototype.init = function() {
  
};