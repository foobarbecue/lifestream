/**
 * Created by aaron on 6/6/16.
 */
import Lifestreams from '../collections.js'
Meteor.subscribe("lifestreams");

const drawLifestream = function(){
    /**
     * Runs on first render and then on zoom / pan events
     */
    let updateAxes = function(){
        d3.selectAll('.lifestreamEvt')
            .attr("cy", (d)=>tscale(d.timestamp));
        d3.selectAll('g.axis').call(ax);
    };

    /**
     * Only runs when new data becomes available
     */
    let render = function(){
        // Add clip-path to hide events that are outside of axes
        d3.selectAll('svg.lifestream')
            .selectAll('defs')
            .data([1]) //Makes sure there will always be exactly one
            .enter()
            .append("clipPath")
            .attr('id',"lstrm-clip")
            .append("rect")
            .attr({y:-1000, width:100, height:850});

        // Draw lifestream events
        d3.select('svg.lifestream')
            .attr("viewBox","0 -1000 100 1000")
            .attr("preserveAspectRatio","xMaxYMin")
            .selectAll("g.lane")
            .data(lstrmData)
            .enter()
            .append("g")
            .attr("transform", (d, i)=>`translate(${i * 10},0)`)
            .attr("class", "lane")
            .attr("clip-path","url(#lstrm-clip)")
            .selectAll("circle")
            .data((d, i)=>d.items) // d is lstrm[i]
            .enter()
            .append("circle")
            .attr("class","lifestreamEvt")
            .attr("r", 4)
            .attr("cx", 10);

        // Draw the time axis (y)
        d3.selectAll('svg.lifestream')
            .selectAll('g.axis')
            .data([1]) //Makes sure there will always be exactly one y-axis
            .enter()
            .append("g")
            .attr("class", "axis");

        // Draw the service name labels (x)
        d3.selectAll('g.lane')
            .selectAll("text")
            .data((d)=>[d])
            .enter()
            .append("text")
            .text((d)=>d._id)
            .attr("text-anchor","end")
            .attr("transform","translate(14,-145)rotate(-90)")
            .attr("class","axis")
            .style("font-variant","small-caps");
    };
    // Setup
    const endDate = new Date();
    let startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 1);
    let lstrmData = Lifestreams.find().fetch();
    let tscale = d3.time.scale()
        .range([-150, -1000])
        .domain([startDate, endDate]);
    let ax = d3.svg.axis()
        .scale(tscale)
        .orient("right");
    // .ticks(d3.time.week)
    // .tickFormat(d3.time.format("%Y-%m-%d"));
    let panZoom = d3.behavior.zoom()
        .y(tscale)
        .on("zoom", updateAxes);
    d3.select('svg.lifestream')
        .call(panZoom);

    render();
    updateAxes();
};

Template.lifestream.helpers({
    drawLifestream:drawLifestream
});