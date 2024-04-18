
// Load the data
averageprice = d3.csv("df_all_average.csv")

averageprice.then(data => {
    // Convert string numbers to numbers
    data.forEach(d => {
        d.avgprice = +d.avgprice;
        d.staytype = +d.staytype;
    });

    // Group the data by neighborhood and stay type
    const groupedData = d3.group(data, d => d.neighbourhood, d => d.staytype);

    // Set up the dimensions and margins for the chart
    const margin = { top: 50, right: 50, bottom: 30, left: 60 };
    const width = 600;
    const height = 400;

    // Create SVG element
    const svg = d3.select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .attr("color", "black");


    // Calculate the average price for each neighborhood and stay type combination
    const avgPrices = Array.from(groupedData, ([neighborhood, stayTypes]) => ({
        neighborhood,
        hotelAvgPrice: stayTypes.get(0) ? d3.mean(stayTypes.get(0), d => d.avgprice) : 0,
        airbnbAvgPrice: stayTypes.get(1) ? d3.mean(stayTypes.get(1), d => d.avgprice) : 0
    }));

    // Set up x scale
    const xScale = d3.scaleBand()
        .domain(avgPrices.map(d => d.neighborhood))
        .range([0, width])
        .padding(0.1);

    // Set up y scale
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(avgPrices, d => Math.max(d.hotelAvgPrice, d.airbnbAvgPrice))])
        .nice()
        .range([height, 0]);

    // Draw hotel bars
    svg.selectAll(".hotel-bar")
        .data(avgPrices)
        .enter()
        .append("rect")
        .attr("class", "hotel-bar")
        .attr("x", d => xScale(d.neighborhood))
        .attr("y", d => yScale(d.hotelAvgPrice))
        .attr("width", xScale.bandwidth() / 2)
        .attr("height", d => height - yScale(d.hotelAvgPrice))
        .attr("fill", "steelblue");

    // Draw Airbnb bars
    svg.selectAll(".airbnb-bar")
        .data(avgPrices)
        .enter()
        .append("rect")
        .attr("class", "airbnb-bar")
        .attr("x", d => xScale(d.neighborhood) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.airbnbAvgPrice))
        .attr("width", xScale.bandwidth() / 2)
        .attr("height", d => height - yScale(d.airbnbAvgPrice))
        .attr("fill", "orange");

    // Add x-axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-45)");

    // Add y-axis
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));

    // Add chart title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Average Prices for Hotels and Airbnbs by Neighborhood in NYC");

    yAxis = svg.append('text')
        .attr('x', 30)
        .attr('y', 30)
        .style('stroke', 'black')
        .text('Price in $');
      
    xAxis.append('text')
        .attr('x', width - margin.right)
        .attr('y', -10)
        .style('stroke', 'black')
        .text('Neighbourhoods');
});