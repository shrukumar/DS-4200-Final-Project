// Load the data
const pricyairbnb = d3.csv("topairbnbprices2.csv")

pricyairbnb.then(function(data) {
  // Convert string values to numbers
  data.forEach(function(d) {
      d.AveragePrice = +d.AveragePrice;
  });
  data.sort((a, b) => b.AveragePrice - a.AveragePrice);

  // Define SVG dimensions and margins
  const margin = { top: 30, right: 20, bottom: 50, left: 100 };
  const width = 500 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  // Create SVG element
  const svg = d3.select('#plot')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style('background', '#FFFFFF')
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Define scales
  const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.AveragePrice)])
      .nice()
      .range([0, width]);

  const y = d3.scaleBand()
      .domain(data.map(d => d.Neighborhood))
      .range([0,  height])
      .padding(0.2);

  // Create bars
  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 0 )
      .attr("y", d => y(d.Neighborhood))
      .attr("width", d => x(d.AveragePrice))
      .attr("height", y.bandwidth())
      .attr("fill", "darkgreen");

      svg.selectAll(".label")
      .data(data)
      .enter().append("text")
      .attr("class", "label")
      .attr("x", d => x(d.AveragePrice) - 5) // Adjust position as needed
      .attr("y", d => y(d.Neighborhood) + y.bandwidth() / 2)
      .attr("dy", ".35em")
      .style("text-anchor", "end") // Align text to the end (right) of the bar
      .style("fill", "white") // Set text color to white
      .text(d => "$" + d.AveragePrice.toFixed(2)); // Add a dollar sign before the price
      
  // Add x-axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add y-axis
  svg.append("g")
      .call(d3.axisLeft(y));

  // Add x-axis label
  svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.top + 10)
      .attr("text-anchor", "middle")
      .text("Average Price of Booking (USD)");

  // Add title
  svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("text-decoration", "underline")
      .text("Priciest AirBnB Neighborhoods in NYC");
});
