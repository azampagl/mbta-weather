/**
 * subway map object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param mapScale - 1.0 size is 1147 width x 1039 height in pixels
 * @param stationMapData -- the data array containing station names
 * @param stationLineData -- the meta-data / data description object
 *          parameters line_blue, line_orange, line_green, line_greenB, line_grenC, line_greenD, line_greenE_underground, line_greenE, line_red, line_redB, line_redM
 * @param eventListener -- the event listener 
 * @constructor
 */
SubwayMap = function(_parentElement, mapScale, stationMapData, line_blue, line_orange, 
		line_green, line_greenB, line_greenC, line_greenD, line_greenE_underground, line_greenE, line_red, line_redB, line_redM, eventListener){
    this.parentElement = _parentElement;
	this.eventHandler = $(eventListener);
	this.currentSelection = [];
	
    this.stationMap = stationMapData;
	this.line_blue = line_blue;
	this.line_orange = line_orange; 
	this.line_green = line_green;
	this.line_greenB = line_greenB;
	this.line_greenC = line_greenC;
	this.line_greenD = line_greenD
	this.line_greenE_underground = line_greenE_underground;
	this.line_greenE = line_greenE
	this.line_red = line_red;
	this.line_redB = line_redB;
	this.line_redM = line_redM;

    // define all constants
    this.margin = {top: 20, right: 20, bottom: 20, left: 20};
    //var style = window.getComputedStyle(this.parentElement.node(), null);  // could get fancier detecting parent element size
	this.width = mapScale*1200 + this.margin.left + this.margin.right,
    this.height = mapScale*1100 + this.margin.top + this.margin.bottom;

	this.stationText=[]
	this.svg=[];
	this.mapScale = mapScale;   // max x is 1147 and max y is 1039
	this.stationSize = 8;
	this.undergroundOpacity = 0.4;
	this.aboveGroundOpacity = 0.4;
	this.aboveGroundColor = "gray";
	
    this.init();
}

/**
 *
 */
SubwayMap.prototype.init = function() {
    var myMap = this;
	
	myMap.stationText = myMap.parentElement.append("p")
			.classed("selectionName", true)
			.style("padding-left", "5em")
			.style("font-weight", "bold")
			.style("font-size", "2em");
	myMap.stationText.text("(click to select)");  // &nbsp  (non-breaking space) = \u00A0
	
	myMap.svg = myMap.parentElement.append("svg")
		.attr("width", myMap.width)
		.attr("height", myMap.height)
		.attr("class", "map");
	
	// a rect to eat the selection clicks inside the svg so we can nullify the selection
	var clickEater = myMap.svg.append("rect")
		.attr("width", myMap.width)
		.attr("height", myMap.height)
		.attr("class", "selectionClickEater")
		.style("fill", "white")
	    .on("click", function(d){			
				// zero out selection
				d3.selectAll('.selected')
					.classed('selected', false);
				d3.selectAll(".selectionName").text("(click to select)");
				myMap.updateSelection([]);
			});
		
		
	var blueLine = myMap.svg.append("g").attr("class", "line blue").data(["Blue Line"]);
	myMap.drawSubwayLineArray(myMap.line_blue, blueLine, myMap.mapScale, "blue", myMap.undergroundOpacity);
	var orangeLine = myMap.svg.append("g").attr("class", "line orange").data(["Orange Line"]);
	myMap.drawSubwayLineArray(myMap.line_orange, orangeLine, myMap.mapScale, "orange", myMap.undergroundOpacity);
	var greenLine = myMap.svg.append("g").attr("class", "line green").data(["Green Line"]);
	myMap.drawSubwayLineArray(myMap.line_green, greenLine, myMap.mapScale, "green", myMap.undergroundOpacity);
	myMap.drawSubwayLineArray(myMap.line_greenB, greenLine, myMap.mapScale, myMap.aboveGroundColor, myMap.aboveGroundOpacity);
	myMap.drawSubwayLineArray(myMap.line_greenC, greenLine, myMap.mapScale, myMap.aboveGroundColor, myMap.aboveGroundOpacity);
	myMap.drawSubwayLineArray(myMap.line_greenD, greenLine, myMap.mapScale, myMap.aboveGroundColor, myMap.aboveGroundOpacity);
	myMap.drawSubwayLineArray(myMap.line_greenE_underground, greenLine, myMap.mapScale, "green", myMap.undergroundOpacity);
	myMap.drawSubwayLineArray(myMap.line_greenE, greenLine, myMap.mapScale, myMap.aboveGroundColor, myMap.aboveGroundOpacity);
	var redLine = myMap.svg.append("g").attr("class", "line red").data(["Red Line"]);
	myMap.drawSubwayLineArray(myMap.line_red, redLine, myMap.mapScale, "red", myMap.undergroundOpacity);
	myMap.drawSubwayLineArray(myMap.line_redB, redLine, myMap.mapScale, "red", myMap.undergroundOpacity);
	myMap.drawSubwayLineArray(myMap.line_redM, redLine, myMap.mapScale, myMap.aboveGroundColor, myMap.aboveGroundOpacity);
	
	redLine.on("mouseover", function(d){
				var xPos = 100 * myMap.mapScale;
				var yPos = 1000 * myMap.mapScale
				
				//d3.select(this).append("text").classed("mouseName", true).attr("font-weight", "bold").attr("font-size", "1em")
				myMap.svg.append("text").classed("mouseName", true).attr("font-weight", "bold").attr("font-size", "1em")
					.attr("text-anchor", "left")
					.attr("x", xPos)
					.attr("y", yPos)
					.text(d);
				var lin = d3.selectAll(".line.red").selectAll(".subwayPath")
					.style("stroke-width", 4);
			});
	redLine.on("mouseout", function(d){
				d3.selectAll(".mouseName").remove();
				var lin = d3.selectAll(".line.red").selectAll(".subwayPath")
					.style("stroke-width", 3);
			});
			
	greenLine.on("mouseover", function(d){
				var xPos = 100 * myMap.mapScale;
				var yPos = 1000 * myMap.mapScale
				
				//d3.select(this).append("text").classed("mouseName", true).attr("font-weight", "bold").attr("font-size", "1em")
				myMap.svg.append("text").classed("mouseName", true).attr("font-weight", "bold").attr("font-size", "1em")
					.attr("text-anchor", "left")
					.attr("x", xPos)
					.attr("y", yPos)
					.text(d);
				var lin = d3.selectAll(".line.green").selectAll(".subwayPath")
					.style("stroke-width", 4);
			});
	greenLine.on("mouseout", function(d){
				d3.selectAll(".mouseName").remove();
				var lin = d3.selectAll(".line.green").selectAll(".subwayPath")
					.style("stroke-width", 3);
			});
			
	orangeLine.on("mouseover", function(d){
				var xPos = 100 * myMap.mapScale;
				var yPos = 1000 * myMap.mapScale
				
				//d3.select(this).append("text").classed("mouseName", true).attr("font-weight", "bold").attr("font-size", "1em")
				myMap.svg.append("text").classed("mouseName", true).attr("font-weight", "bold").attr("font-size", "1em")
					.attr("text-anchor", "left")
					.attr("x", xPos)
					.attr("y", yPos)
					.text(d);
				var lin = d3.selectAll(".line.orange").selectAll(".subwayPath")
					.style("stroke-width", 4);
			});
	orangeLine.on("mouseout", function(d){
				d3.selectAll(".mouseName").remove();
				var lin = d3.selectAll(".line.orange").selectAll(".subwayPath")
					.style("stroke-width", 3);
			});
			
	blueLine.on("mouseover", function(d){
				var xPos = 100 * myMap.mapScale;
				var yPos = 1000 * myMap.mapScale
				
				//d3.select(this).append("text").classed("mouseName", true).attr("font-weight", "bold").attr("font-size", "1em")
				myMap.svg.append("text").classed("mouseName", true).attr("font-weight", "bold").attr("font-size", "1em")
					.attr("text-anchor", "left")
					.attr("x", xPos)
					.attr("y", yPos)
					.text(d);
				var lin = d3.selectAll(".line.blue").selectAll(".subwayPath")
					.style("stroke-width", 4);
			});
	blueLine.on("mouseout", function(d){
				d3.selectAll(".mouseName").remove();
				var lin = d3.selectAll(".line.blue").selectAll(".subwayPath")
					.style("stroke-width", 3);
			});
	
	var stationsData = myMap.stationMap;
	var newStations = myMap.svg.selectAll(".node")
	  .data(stationsData)
	  .enter()
	  .append("g")
	  .attr("class", "node")
	  .classed("aboveGround", function(d){ return parseInt(d.underground) == 0 })
	  .classed("underGround", function(d){ return parseInt(d.underground) != 0 })
	  .attr("transform", function(d) { return "translate(" + myMap.mapScale * d.x + "," + myMap.mapScale * d.y + ")"; });

	var stationDots = newStations.append("circle")
	  .attr("r", function(d){
			// make above ground stations a smaller radius
			if(parseInt(d.underground)){
			   return myMap.mapScale * myMap.stationSize;
			}else{
			   return 0.25 * myMap.mapScale * myMap.stationSize;
			}
		})
	  .attr("class", function(d){return (d.name).replace(/[\s/.]/g, '')})  		// the station names include some annoying characters for setting the class, remove white space, forward slahses, and periods
	  .style("stroke", "black")
	  .style("stroke-width", 1)
	  .style("fill", "gray")
	  .style("pointer-events", "all");
	  
	var hitBoxSize = (myMap.mapScale * myMap.stationSize) * 4;
	var undergrounds = newStations.filter(".underGround");
	var stationHitBoxes = undergrounds.append("rect")
	  .attr("width", hitBoxSize)
	  .attr("height", hitBoxSize)
	  .attr("x", -(hitBoxSize)/2)
	  .attr("y", -(hitBoxSize)/2)
	  .attr("class", "stationHitBox")
	  .style("pointer-events", "all")
	  .style("visibility", "hidden");

	undergrounds.on("mouseover", function(d){
			//var xPos = d3.mouse(this)[0];   // this often looks pretty poor on top of the subway lines
			//var yPos = d3.mouse(this)[1];
			var xPos = 100 * myMap.mapScale;
			var yPos = 1000 * myMap.mapScale
			
			//d3.select(this).append("text").classed("mouseName", true).attr("font-weight", "bold").attr("font-size", "1em")
			myMap.svg.append("text").classed("mouseName", true).attr("font-weight", "bold").attr("font-size", "1em")
				.attr("text-anchor", "left")
				.attr("x", xPos)
				.attr("y", yPos)
				.text(d.name);
			var className = (d.name).replace(/[\s/.]/g, '');
			var sel = d3.selectAll("."+className)
			sel.style("fill", "LightSkyBlue");
		})
	  .on("mouseout", function(d){
			d3.selectAll(".mouseName").remove();
			d3.selectAll("."+(d.name).replace(/[\s/.]/g, '')).style("fill", "gray");;
		})

	d3.selectAll(".line").on("click", function(d){
			alreadySelected = this.classList.contains("selected");
			
			// zero out selection
			d3.selectAll('.selected')
				.classed('selected', false);
			d3.selectAll(".selectionName").text("(click to select)");
			
			var newSel = [];
			if(!alreadySelected) {
				this.classList.add('selected');
				var myData = d3.select(this).data();
				d3.selectAll(".selectionName").text("Selected: " + myData);
				newSel = myData;
			}
			myMap.updateSelection(newSel);
		});
	undergrounds.on("click", function(d){
			alreadySelected = this.classList.contains("selected");
			
			// zero out selection
			d3.selectAll('.selected')
				.classed('selected', false);
			d3.selectAll(".selectionName").text("(click to select)");
			
			var newSel = [];
			if(!alreadySelected) {
				this.classList.add('selected');
				var myData = d3.select(this).select("circle").data();
				d3.selectAll(".selectionName").text("Selected: " + myData[0].name);
				newSel = myData[0].id;
			}
			myMap.updateSelection();
		});
};

// function to highlight elements with 'selected' class type
SubwayMap.prototype.updateSelection = function(newSelection){
	var myMap = this;
	lines = d3.selectAll('.line');
	selectedLine = lines.filter('.selected');
	lines.selectAll(".subwayPath")
		.style("stroke-width", 3)
		.style("stroke-opacity", 0.4);
	selectedLine.selectAll(".subwayPath")
		.style("stroke-width", 4)
		.style("stroke-opacity", 0.8);
	
	stations = d3.selectAll('.node').filter('.underground');
	selectedStation = stations.filter('.selected');
	stations.selectAll('circle')
		.attr("r", myMap.mapScale * myMap.stationSize);
	selectedStation.selectAll('circle')
		.attr("r", 2 * myMap.mapScale * myMap.stationSize);
	if(newSelection != myMap.currentSelection){
		myMap.eventHandler.trigger("selectionChange", newSelection);
		myMap.currentSelection = newSelection;
	}
};

// helper function for drawing the subway lines as a path
// line data is imported with x and y cartesian map position (pixels)
SubwayMap.prototype.drawSubwayLineArray = function(lineData, svgContainer, mapScale, color, opacity){
	// line generator for nice, smooth lines
	var line = d3.svg.line()
		  .interpolate("cardinal")
		  .x(function(d) { return mapScale * d.x; })
		  .y(function(d) { return mapScale * d.y; });
	  
	  
	var lineGroup = svgContainer.append('g');
	  
	// hidden path to increase hitbox size for selection 
	lineGroup.append("path")
	  .attr("d", line(lineData))
	  .style("stroke-width", 11)
	  .style("fill", "none")
	  .style('visiblity', 'hidden')
	  .style("pointer-events", "stroke");

	// visible path
	var links = lineGroup.append("path")
	  .attr("class", "subwayPath")
	  .attr("d", line(lineData))
	  .style("stroke", color)
	  .style("stroke-width", 3)
	  .style("fill", "none")
	  .style("stroke-opacity", opacity)
	  .style("pointer-events", "stroke");
};