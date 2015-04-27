/**
 * subway map object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 *      map is scaled to fit in the parents WIDTH
 * @param stationMapData -- the data array containing station names
 * @param stationSummaryData -- the data array containing the summaries per station for each of our filter categories
 * @param stationLineData -- the meta-data / data description object
 *          parameters line_blue, line_orange, line_green, line_greenB, line_grenC, line_greenD, line_greenE_underground, line_greenE, line_red, line_redB, line_redM
 * @param eventListener -- the event listener
 * @constructor
 */
SubwayMap = function(_parentElement, stationMapData, stationSummaryData, line_blue, line_orange,
		line_green, line_greenB, line_greenC, line_greenD, line_greenE_underground, line_greenE, line_red, line_redB, line_redM, eventListener){
    this.parentElement = _parentElement;
	this.eventHandler = $(eventListener);
	this.currentSelection = [];
	
	var myMap = this;
	this.eventHandler.on("dayCatChange", function(e, flag) {
		myMap.dayCatChange(flag);
	});

	this.eventHandler.on("filterChange", function(e, id_snow, id_rain, flag_daycat) {
		myMap.filterChange(id_snow, id_rain, flag_daycat);
	});

    this.stationMap = stationMapData;
	this.stationEntries = stationSummaryData;
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

	this.snowBinKeys = ["no_snow", "0", "(0, 2)", "(2, 4)", "(4, 8)", "(8, 15)", "15"];
	this.rainBinKeys = ["no_rain", "drizzle", "rain_not_drizzle"];
	this.dayCategory = 1;  // 1 = weekday, 2 = weekend
	this.snowBinIdx = 0;  // 0 off, index into this.snowBinKeys
	this.rainBinIdx = 0;  // 0 off, index into this.rainBinKeys
	
	
	var width = _parentElement.node().getBoundingClientRect().width;
	
    // define all constants
    this.margin = {top: 20, right: 10, bottom: 10, left: 20};
	this.mapScale = Math.min((1.0 / 1160.0) * width, (1.0 / 1050.0) * $(document).height() );   // max x is 1147 and max y is 1039
	this.width = this.mapScale * 1200.0 + this.margin.left + this.margin.right,
    this.height = this.mapScale * 1100.0 + this.margin.top + this.margin.bottom;
	
	
	this.stationText=[]
	this.svg=[];
	//this.mapScale = mapScale;   // max x is 1147 and max y is 1039
	this.stationSize = 8;
	this.undergroundOpacity = 0.4;
	this.aboveGroundOpacity = 0.4;
	this.aboveGroundColor = "gray";

	this.yHooverTextPos = 170;
	this.xHooverTextPos = 100;
	
	this.yColorbar = 850;
	this.xColorbar = 390;
	this.colorbar = d3.select("colorbar");
	
    this.init();
}

/**
 *
 */
SubwayMap.prototype.init = function() {
    var myMap = this;

	/*myMap.stationText = myMap.parentElement.append("p")
			.classed("selectionName", true)
			.style("padding-left", "5em")
			.style("font-weight", "bold")
			.style("font-size", "2em");
	myMap.stationText.text("(click to select)");  // &nbsp  (non-breaking space) = \u00A0
	*/

	myMap.svg = myMap.parentElement.append("svg")
		.attr("width", myMap.width)
		.attr("height", myMap.height)
		.attr("class", "map")
		.append("g")
		.attr("transform", function(d) { return "translate(" + myMap.margin.left + "," + myMap.margin.top + ")"; });


	// a rect to eat the selection clicks inside the svg so we can nullify the selection
	/*var clickEater = myMap.svg.append("rect")
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
			});*/


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
				var xPos = myMap.xHooverTextPos * myMap.mapScale;
				var yPos = myMap.yHooverTextPos * myMap.mapScale

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
				var xPos = myMap.xHooverTextPos * myMap.mapScale;
				var yPos = myMap.yHooverTextPos * myMap.mapScale

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
				var xPos = myMap.xHooverTextPos * myMap.mapScale;
				var yPos = myMap.yHooverTextPos * myMap.mapScale

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
				var xPos = myMap.xHooverTextPos * myMap.mapScale;
				var yPos = myMap.yHooverTextPos * myMap.mapScale

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
	// add in default color
	for(var i = 0; i < stationsData.length; i++){
		stationsData[i].color = myMap.aboveGroundColor;
	}
	
	var newStations = myMap.svg.selectAll(".node")
	  .data(stationsData)
	  .enter()
	  .append("g")
	  .attr("class", "node")
	  .classed("aboveGround", function(d){ return parseInt(d.underground) == 0 })
	  .classed("underGround", function(d){ return parseInt(d.underground) != 0 })
	  .attr("transform", function(d) { return "translate(" + myMap.mapScale * (d.x-99) + "," + myMap.mapScale * (d.y-40) + ")"; });  // min x and y are 99 and 40 respectively

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
	  .style("fill", function(d){return (d.color).replace(/[\s/.]/g, '')})
	  .style("stroke-width", 1)
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
	
	
	  
	// start with Harvard as selection
	var harvardStation = stationDots.filter(".Harvard")
	d3.select(harvardStation[0][0].parentNode).classed('selected', true);
	var harData = harvardStation.data();
	//d3.selectAll(".selectionName").transition().text("Selected: " + harData[0].name);
	newSel = harData[0].id;
	myMap.updateSelection(newSel);
	
	
	undergrounds.on("mouseover", function(d){
			//var xPos = d3.mouse(this)[0];   // this often looks pretty poor on top of the subway lines
			//var yPos = d3.mouse(this)[1];
			var xPos = myMap.xHooverTextPos * myMap.mapScale;
			var yPos = myMap.yHooverTextPos * myMap.mapScale;

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
			//d3.selectAll("."+(d.name).replace(/[\s/.]/g, ''))
			//.style("fill", function(d, i){return d});
			undergrounds.selectAll("circle").style("fill", function(d,i){return d.color});  // reset everything
		})

	d3.selectAll(".line").on("click", function(d){
			alreadySelected = this.classList.contains("selected");

			var newSel = [];
			if(!alreadySelected) {
				// zero out other selections
				d3.selectAll('.selected')
					.classed('selected', false);
				
				this.classList.add('selected');
				var myData = d3.select(this).data();
				//d3.selectAll(".selectionName").text("Selected: " + myData);
				newSel = myData;
				myMap.updateSelection(newSel);
			}
		});
	undergrounds.on("click", function(d){
			alreadySelected = this.classList.contains("selected");

			var newSel = [];
			if(!alreadySelected) {
				// zero out other selections
				d3.selectAll('.selected')
					.classed('selected', false);
			
				this.classList.add('selected');
				var myData = d3.select(this).select("circle").data();
				//d3.selectAll(".selectionName").transition().text("Selected: " + myData[0].name);
				newSel = myData[0].id;
				myMap.updateSelection(newSel);
			}
		});
};

// function to highlight elements with 'selected' class type
// 		newSelection is a unique id for the selected element (must support !=)
SubwayMap.prototype.updateSelection = function(newSelection){
	var myMap = this;
	var lines = d3.selectAll('.line');
	var selectedLine = lines.filter('.selected');
	lines.selectAll(".subwayPath")
		.style("stroke-width", 3)
		.style("stroke-opacity", 0.4);
	selectedLine.selectAll(".subwayPath")
		.style("stroke-width", 4)
		.style("stroke-opacity", 0.8);

	var stations = d3.selectAll('.node').filter('.underGround');
	var selectedStation = stations.filter('.selected');
	stations.selectAll('circle')
		.attr("r", myMap.mapScale * myMap.stationSize);
	selectedStation.selectAll('circle')
		.attr("r", 2 * myMap.mapScale * myMap.stationSize);
	if(newSelection != myMap.currentSelection){
		myMap.eventHandler.trigger("stationChange", newSelection);
		myMap.currentSelection = newSelection;
	}
};

// adjust the fill color of the stations to match their shrinkage of ridership
// snowTickIdx is tick index - ie 0, 1, 2, 3
// rainTickIdx is tick index - ie 0, 1, 2, 3
//     only 1 of snowTickIdx and rainTickIdx can be non-zero!!!!!
// dayFlag is 0 is no change, 1 = weekday, 2 = weekend
SubwayMap.prototype.filterChange = function(snowTickIdx, rainTickIdx, dayFlag){
	var myMap = this;
	
	myMap.snowBinIdx = snowTickIdx;
	
	myMap.rainBinIdx = rainTickIdx;  // different than snow since the 0 idx is redundant to off in our stationEntries data array
	myMap.rainBinIdx = rainTickIdx;  // different than snow since the 0 idx is redundant to off in our stationEntries data array
	
	if(dayFlag == 1 || dayFlag == 2){
		myMap.dayCategory = dayFlag;  // 1 = weekday, 2 = weekend
	}
	
	myMap.updateColoring();
}

// adjust the fill color of the stations to match their shrinkage of ridership
//  1 = weekday, 2 = weekend
SubwayMap.prototype.dayCatChange = function(dayFlag){
	var myMap = this;
	myMap.dayCategory = dayFlag;  // 1 = weekday, 2 = weekend
	
	myMap.updateColoring();
}

// get the entries after the snow and rain is applied and using dayCategory flags from the this.stationEntries data array
// using the specified station ID
SubwayMap.prototype.getEntriesWithWeather = function(stationID){
	var myMap = this;
	
	var key1 = "";
	if(myMap.snowBinIdx == 0 && myMap.rainBinIdx == 0){
		if(myMap.dayCategory == 2){
			key1 = "weekend_daily_avg";
		}else if(myMap.dayCategory == 1){
			key1 = "weekday_daily_avg";
		}
		
		for(var i = 0; i < myMap.stationEntries.length; i++){
			if(stationID == myMap.stationEntries[i]["station_id"]){
				return myMap.stationEntries[i][key1];
			}
		}
	}
	
	key1 = "weekend";
	if(myMap.dayCategory == 1){ key1 = "weekday"; }
	
	var key2 = "snow"
	var key3 = myMap.snowBinKeys[myMap.snowBinIdx];
	if(myMap.rainBinIdx > 0){ 
		// since we already covered the case where both rain and snow are 0, we know either rain is set or snow is (both is not an allowed setting)
		key2 = "rain"; 
		key3 = myMap.rainBinKeys[myMap.rainBinIdx];
	}
	for(var i = 0; i < myMap.stationEntries.length; i++){
		if(stationID == myMap.stationEntries[i]["station_id"]){
			return myMap.stationEntries[i][key1][key2][key3];
		}
	}
};

// get the normal entries using the snow and rain and dayCategory flags from the this.stationEntries data array
// using the specified station ID
//
//   ie with a snow bin get the winter average
//   and without get the global average
SubwayMap.prototype.getNormEntries = function(stationID){
	var myMap = this;
	
	var key1 = "";
	if(myMap.snowBinIdx == 0 && myMap.rainBinIdx == 0){
		if(myMap.dayCategory == 2){
			key1 = "weekend_daily_avg";
		}else if(myMap.dayCategory == 1){
			key1 = "weekday_daily_avg";
		}
		
		for(var i = 0; i < myMap.stationEntries.length; i++){
			if(stationID == myMap.stationEntries[i]["station_id"]){
				return myMap.stationEntries[i][key1];
			}
		}
	}
	
	key1 = "weekend";
	if(myMap.dayCategory == 1){ key1 = "weekday"; }
	
	var key2 = "snow"
	var key3 = myMap.snowBinKeys[0];  // the no snow index
	if(myMap.rainBinIdx > 0){ 
		// since we already covered the case where both rain and snow are 0, we know either rain is set or snow is (both is not an allowed setting)
		key2 = "rain"; 
		key3 = myMap.rainBinKeys[0];  // the no rain index
	}
	for(var i = 0; i < myMap.stationEntries.length; i++){
		if(stationID == myMap.stationEntries[i]["station_id"]){
			return myMap.stationEntries[i][key1][key2][key3];
		}
	}
	
};

SubwayMap.prototype.updateColoring = function(){
	var myMap = this;

	var stations = d3.selectAll('.node.underGround');
	
	myMap.colorbar.remove();
	myMap.colorbar = d3.selectAll('colorbar');;
	
	var myData = stations.data();
	var n_stations = myData.length;
	if(this.snowBinIdx == 0 && this.rainBinIdx == 0){
		// 'None condition'
		for (var i = 0; i < n_stations; i++) {
			myData[i].color = "gray";
		}
		stations.data(myData);
	}else{
		
		// find the ridership for our current filters
		var riders = new Array(n_stations);
		var normRiders = new Array(n_stations);
		var perChange = new Array(n_stations);		
		var stationData = stations.data();
		for (var i = 0; i < n_stations; i++) {
			var stationID = parseFloat(stationData[i].id);
			riders[i] = myMap.getEntriesWithWeather(stationID);
			normRiders[i] = myMap.getNormEntries(stationID);
			if(normRiders[i] > 0){
				perChange[i] = 1.0 - (riders[i] / normRiders[i]);
			}else{
				perChange[i] = 0;
			} 
		}
		//console.log(riders);
		console.log(normRiders);
		
		var maximumChange = Math.max.apply(Math, perChange);;  // maximum percent change over all stations with current filters
		// second loop now that maximum value is known
		var hue = 105; // 105 is a green [range 0-360]
		var sat = .5; // neutral saturation
		var lightness = 0;
		for (var i = 0; i < n_stations; i++) {
			lightness = (1 - perChange[i]/maximumChange)*0.7 + 0.15;  // range of 0.15 to 0.85
			myData[i].color = d3.hsl(hue, sat, lightness);
		}
		stations.data(myData);
		
		
		// NOT WORKING ... move into variable of the subwaymap class instead of storing in each element -DB
		// now applying the data makes the color super easy
		//var stationCircs = stations.selectAll('circle')
		//	.data(myColor);
		//	.style("fill", function(d){return d});  // They all get the color of myColor[0] for some reason	
		//console.log(stations)
		
		// add a colorbar
		var oneDecimalFormat = d3.format(".1f");
		var colorbarWidth = 250;
		myMap.addColorbar(myMap.mapScale * myMap.xColorbar, myMap.mapScale * myMap.yColorbar, myMap.mapScale * colorbarWidth, hue, sat, 0.15, 0.85,  oneDecimalFormat(maximumChange * -100) + ' %', '0 %');
	}
	//console.log(stations.selectAll('circle'))
	stations.selectAll('circle')
			.style("fill", function(d){return d.color});
};

// a colorbar for a single hue where only the lightness is changed
SubwayMap.prototype.addColorbar = function(x, y, width, hue, sat, minLightness, maxLightness, minLabel, maxLabel){
	var myMap = this;
	myMap.colorbar = this.svg.append("g").attr("class", "colorbar");
	
	var numColors = Math.min(10, Math.max( 3, width/10));   // minimum of 3 colors and maximum of 10 shades in colorbar with natural size of 10 px per color
	var colorSplotchWidth = width/numColors;
	var colorSplotchHeight = Math.min(colorSplotchWidth, 15) // 15 px max height for colors
	var xs = new Array(numColors);
	for(var i=0; i< numColors; i++){
		xs[i] = x + i * colorSplotchWidth;
	}
	
	myMap.colorbar.append("g")
		.attr("class", "swatches")
		.selectAll("rect")
		.data(xs)
		.enter()
		.append("rect")
		.attr("x", function(d,i){return d})
		.attr("y", y)
		.attr("width", colorSplotchWidth)
		.attr("height", colorSplotchHeight)
		.style("fill", function(d,i){return d3.hsl(hue, sat, minLightness + (i/numColors * maxLightness))});
		
	myMap.colorbar.append("text")
		.attr("x", x-colorSplotchWidth)
		.attr("y", y-15)
		.style("text-align", "center")
		.text(minLabel);
		
	myMap.colorbar.append("text")
		.attr("x", x+width)
		.attr("y", y-15)
		.style("text-align", "center")
		.text(maxLabel);
};



// helper function for drawing the subway lines as a path
// line data is imported with x and y cartesian map position (pixels)
SubwayMap.prototype.drawSubwayLineArray = function(lineData, svgContainer, mapScale, color, opacity){
	// line generator for nice, smooth lines
	var line = d3.svg.line()
		  .interpolate("cardinal")
		  .x(function(d) { return mapScale * (d.x-99); })    // min x is 99 in green line
		  .y(function(d) { return mapScale * (d.y-40); });	 // min y is 40 in orange line


	var lineGroup = svgContainer.append('g');

	// hidden path to increase hitbox size for selection
	lineGroup.append("path")
	  .attr("d", line(lineData))
	  .style("stroke-width", 11)
	  .style("stroke", "black")
	  .style("fill", "none")
	  .style("pointer-events", "stroke")
	  .style("visibility", "hidden");

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
