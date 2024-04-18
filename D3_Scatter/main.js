// Load the data
const nyc = d3.csv("brooklyn_data.csv");


// Once the data is loaded, proceed with plotting
nyc.then(function(data) {
   // Convert string values to numbers
   data.forEach(function(d) {
       d.price = +d.price;
       d.availability_365 = +d.availability_365;
   });


let width = 400, height = 150;
let margin = {
       top: 30,
       bottom: 60,
       left: 80,
       right: 100
   };


   // Create the SVG container
   let svg = d3.select('#scatterplot')
       .append('svg')
       .attr('width', width)
       .attr('height', height)
       .style('background', 'lightblue') //set background color
  
   // Create a color scale
   const colorScale = d3.scaleOrdinal()
       .domain(data.map(d => d.room_type))
       .range(d3.schemeCategory10);
    // Y is price
   let yScale = d3.scaleLinear() //create a linear scale
       .domain([d3.min(data, d => d.price), d3.max(data, d => d.price)]) //set the domain
       .range([height - margin.bottom, margin.top]); //set the range (position in the svg)


   let yAxis = svg
       .append('g') //append a group element
       .attr('transform', `translate(${margin.left}, 0)`) // translate the axis to the left
       .call(d3.axisLeft().scale(yScale)); // call the axis function


   // X is availability
   let xScale = d3.scaleLinear() // create a linear scale
   .domain([d3.min(data, d => d.availability_365), d3.max(data, d => d.availability_365)])
   .range([margin.left, width - margin.right]); //set the range (position in the svg)


   let xAxis = svg.append('g') // append a group element
       .call(d3.axisBottom().scale(xScale)) // call the axis function
       .attr('transform', `translate(0, ${height - margin.bottom})`); //translate the axis to the bottom




   // Add circles for each data point
   let circle = svg.selectAll('circle')
       .data(data)
       .enter()
       .append('circle')
       .attr('cx', d => xScale(d.availability_365) )//set the x position for the circle
       .attr('cy', d => yScale(d.price)) //set the y position for the circle
       .attr('r', 1) //set the radius of the circle
       .attr('fill', 'blue')
       //.attr('fill', d => colorScale(d.neighbourhood_group)); //set the color of the circle


// Add x-axis label
xAxis = svg.append('text')
       .attr('x', margin.top + 100)
       .attr('y', height - 20)
       .style('stroke', 'black')
       .text('Availability (days)');




// Add y-axis label
yAxis = svg.append('text')
       .attr('x', -margin.top + 30)
       .attr('y', margin.left - 60)
       .style('stroke', 'black')
       .text('Price (USD)');
}   
)  
