// @TODO: YOUR CODE HERE!
// Define the chart's margins as an object
var svgWidth = 960;
var svgHeight = 500;

var margin = {
	top: 20,
	right: 40,
	bottom: 60,
	left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data 
d3.csv("/assets/data/data.csv").then(function(data) {
	//console.log(data);

	data.forEach(function(d) {
		d.healthcare = parseFloat(d.healthcare);
    	d.income = parseFloat(d.income);
	});

	// Step 2: Create scale functions
	// ==============================
	var xLinearScale = d3.scaleLinear()
    	.domain([38000, d3.max(data, d => d.income)])
    	.range([0, width]);
    //console.log(d3.max(data, d => d.income))

	var yLinearScale = d3.scaleLinear()
    	.domain([3.5, d3.max(data, d => d.healthcare)])
    	.range([height, 0]);
	//console.log(d3.max(data, d => d.healthcare));

	// Step 3: Create axis functions
	// ==============================
	var bottomAxis = d3.axisBottom(xLinearScale);
  	var leftAxis = d3.axisLeft(yLinearScale);

  	// Step 4: Append Axes to the chart
  	// ==============================
  	chartGroup.append("g")
    	.attr("transform", `translate(0, ${height})`)
    	.call(bottomAxis);

  	chartGroup.append("g")
    	.call(leftAxis);

  	// Step 5: Create Circles and labels
  	// ==============================
  	var circlesGroup = chartGroup.selectAll("circle")
  		.data(data)
  		.enter()
    	.append("circle")
    	.attr("cx", d => xLinearScale(d.income))
    	.attr("cy", d => yLinearScale(d.healthcare))
    	.attr("r", "15")
    	.attr("class", "stateCircle");
    var circleText = chartGroup.selectAll("text")
    	.data(data)
    	.enter()
    	.append("text")
    	.attr("x", d => xLinearScale(d.income))
  		.attr("y", d => yLinearScale(d.healthcare))
  		// .attr("text-anchor", "middle")
  		.attr("alignment-baseline", "middle")
  		.style("font-size","6px")
  		.attr("class", "stateText")
  		.text(d => d.abbr);

	// Step 6: Initialize tool tip
   	// ==============================
   	var toolTip = d3.tip()
    	.attr("class", "d3-tip")
     	.offset([80, -60])
     	.html(function(d) {
			return (`${d.state}<br>Income: ${d.income}<br>Healthcare: ${d.healthcare}`);
		});

	// Step 7: Create tooltip in the chart
	// ==============================
	chartGroup.call(toolTip);

	// Step 8: Create event listeners to display and hide the tooltip
	// ==============================
	circlesGroup.on("click", function(data) {
		toolTip.show(data, this);
	})

	// onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

	// Create axes labels
	chartGroup.append("text")
    	.attr("transform", "rotate(-90)")
    	.attr("y", 0 - margin.left + 40)
    	.attr("x", 0 - (height / 2))
    	.attr("dy", "1em")
    	.attr("class", "axisText")
    	.text("Lacks Healthcare (%)");

	chartGroup.append("text")
    	.attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    	.attr("class", "axisText")
    	.text("Household Income (Median)");
    }).catch(function(error) {
	console.log(error);
});