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
        .range([-150, -1000])
        .domain([startDate, endDate]);

    d3.select('svg.lifestream')
        .selectAll("g")
        .data(lstrmData)
        .enter()
        .append("g")
        .attr("transform",(d,i)=>`translate(${i*10},0)`)
      .selectAll("circle")
        .data((d, i)=>d.items) // d is lstrm[i]
        .enter()
        .append("circle")
        .attr("r",4)
        .attr("cx",10)
        .attr("cy",(d)=>tscale(d.timestamp));
};

Template.lifestream.helpers({
    drawLifestream:drawLifestream
});