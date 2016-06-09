/**
 * Created by aaron on 6/6/16.
 */
import Lifestreams from '../collections.js'
Meteor.subscribe("lifestreams");

const drawLifestream = function(){
    const endDate = new Date();
    let startDate = new Date();
    startDate.setMonth(endDate.getMonth()-1);
    const lstrmData = Lifestreams.find().fetch();
    const tscale = d3.time.scale()
        .range([0, 1000])
        .domain([startDate, endDate]);

    d3.select('svg.lifestream')
        .selectAll("g.lane")
        .data(lstrmData)
        .enter()
        .append("g")
        .attr("transform",(d,i)=>`translate(${i*10},0)`)
        .attr("class","lane")
      .selectAll("circle")
        .data((d, i)=>d.items) // d is lstrm[i]
        .enter()
        .append("circle")
        .attr("r",4)
        .attr("cx",10)
        .attr("cy",(d)=>tscale(d.timestamp));

    let ax = d3.svg.axis()
        .scale(tscale)
        .orient("right")
        .ticks(d3.time.week)
        .tickFormat(d3.time.format("%Y-%m-%d"));

    console.log('drawinaxis')
    d3.selectAll('svg.lifestream')
        .selectAll('g.axis')
        .data([1])
        .enter()
        .append("g")
        .attr("class","axis")
        .call(ax)
};

Template.lifestream.helpers({
    drawLifestream:drawLifestream
});