/**
 * Created by aaron on 6/6/16.
 */
import Lifestreams from '../collections.js'

const drawLifestream = function(){
    const endDate = new Date();
    let startDate = new Date();
    startDate.setMonth(endDate.getMonth()-1);
    const lstrmData = Lifestreams.find().fetch();
    const tscale = d3.time.scale()
        .range([-150, -1000])
        .domain([startDate, endDate]);
    d3.select('svg.lifestream')
        .selectAll("circle")
        .data(lstrmData)
        .enter()
        .append("circle")
        .attr("r",4)
        .attr("cx",10)
        .attr("cy",(d)=>tscale(d.timestamp));
    // d3.selectAll('g.feed circle').attr("cy", getYPos);
};

Template.lifestream.helpers({
    drawLifestream:drawLifestream
});