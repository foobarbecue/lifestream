/**
 * Created by aaron on 6/6/16.
 */
import Lifestreams from '../collections.js'
Meteor.subscribe("lifestreams");

const drawLifestream = function(){
    let updateAxes = function(){
        d3.selectAll('.lifestreamEvt')
            .attr("cy", (d)=>tscale(d.timestamp));
        d3.selectAll('g.axis').call(ax);
    };

    let render = function(){
        d3.select('svg.lifestream')
            .selectAll("g.lane")
            .data(lstrmData)
            .enter()
            .append("g")
            .attr("transform", (d, i)=>`translate(${i * 10},0)`)
            .attr("class", "lane")
            .selectAll("circle")
            .data((d, i)=>d.items) // d is lstrm[i]
            .enter()
            .append("circle")
            .attr("class","lifestreamEvt")
            .attr("r", 4)
            .attr("cx", 10)
            .attr("cy", (d)=>tscale(d.timestamp));

        d3.selectAll('svg.lifestream')
            .selectAll('g.axis')
            .data([1])
            .enter()
            .append("g")
            .attr("class", "axis")
            .call(ax)
    };
    // Setup
    const endDate = new Date();
    let startDate = new Date();
    startDate.setMonth(endDate.getMonth()-1);
    let lstrmData = Lifestreams.find().fetch();
    let tscale = d3.time.scale()
        .range([0, 1000])
        .domain([startDate, endDate]);
    let ax = d3.svg.axis()
        .scale(tscale)
        .orient("right")
        // .ticks(d3.time.week)
        // .tickFormat(d3.time.format("%Y-%m-%d"));
    let panZoom = d3.behavior.zoom()
        .y(tscale)
        .on("zoom",updateAxes);
    d3.select('svg.lifestream')
        .call(panZoom);
    render();
};

Template.lifestream.helpers({
    drawLifestream:drawLifestream
});