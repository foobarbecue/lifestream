/**
 * Created by aaron on 6/6/16.
 */
import { Template } from 'meteor/templating';
import './timeline.css';
import './timeline.html';
Lifestreams = new Mongo.Collection('lifestreams');
Meteor.subscribe("lifestreams");
var drawLifestream = function(){
    /**
     * Runs on first render and then on zoom / pan events
     */
    var updateAxes = function(){
        d3.selectAll('.lifestreamEvt')
            .attr("cy", (d)=>tscale(d.timestamp));
        d3.selectAll('g.axis').call(ax);
    };

    /**
     * Only runs when new data becomes available
     */
    var render = function(){
        // Add clip-path to hide events that are outside of axes
        d3.selectAll('svg.lifestream')
            .selectAll('clipPath')
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
            .selectAll("circle")
            .data((d, i)=>d.items) // d is lstrm[i]
            .enter()
            .append("circle")
            .attr("class","lifestreamEvt")
            .attr("clip-path","url(#lstrm-clip)")
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

        // Draw the tooltip
        d3.selectAll('svg.lifestream')
            .selectAll('div')
            .data([1])
            .append("div") //Makes sure there will always be exactly one tooltip div
            .style("position", "absolute")
            .style("z-index", "10")
            .attr("class","ttp")

        // Mouseovers setup
        let tooltipEl = d3.select("div.ttp");
        d3.selectAll(".lifestreamEvt")
            .on("mouseenter",
                function(d){
                    tooltipEl.html(d.summaryHTML);
                    $(".axis").show();
                    $(".ttp").show();
                    tooltipEl
                        .style("top",d3.event.y + "px")
                        .style("right",window.innerWidth - d3.event.x + "px");
                });
        tooltipEl
            .on("mouseenter", function(){
                tooltipEl.transition().duration(0);
                tooltipEl.style('display','block')
            })
            .on("mouseleave", function(){
                tooltipEl.style('display','none');
                tooltipEl.html('');
            });


    };
    // Scales etc. setup
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
    let panZoom = d3.behavior.zoom()
        .y(tscale)
        .on("zoom", updateAxes);

    d3.select('svg.lifestream')
        .call(panZoom);

    // Show the axis when mouse goes over the lifestream
    // lstrmEl.on("mouseenter",
    //     function() {
    //         $(".axis").fadeIn()
    //     });
    // lstrmEl.on("mouseleave",
    //     function() {
    //         $(".axis").hide();
    //         tooltipEl.transition().delay(500).style('display','none');
    //     });

    render();
    updateAxes();
};

Template.registerHelper('drawLifestream',drawLifestream);