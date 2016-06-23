/**
 * Created by aaron on 6/19/16.
 */
    //Import d3
import { Template } from 'meteor/templating';
import './timeline.css';
import './timeline.html';
Lifestreams = new Mongo.Collection('lifestreams');
Meteor.subscribe("lifestreams");

class LifestreamTimeline {
    constructor(){
        // Scales etc. setup
        this.endDate = new Date();
        this.startDate= new Date();
        this.startDate.setMonth(this.endDate.getMonth() - 1);
        this.tscale = d3.time.scale()
            .range([-150, -1000])
            .domain([this.startDate, this.endDate]);
        this.ax = d3.svg.axis()
            .scale(this.tscale)
            .orient("right");
    }
    render(eventDataCursor) {        // Add clip-path to hide events that are outside of axes
        let self = this;
        d3.selectAll('svg.lifestream')
            .selectAll('clipPath')
            .data([1]) //Makes sure there will always be exactly one
            .enter()
            .append("clipPath")
            .attr('id',"lstrm-clip")
            .append("rect")
            .attr({y:-1000, width:100, height:850});

        // Draw lifestream events
        let newEvts = d3.select('svg.lifestream')
            .attr("viewBox","0 -1000 100 1000")
            .attr("preserveAspectRatio","xMaxYMin")
            .selectAll("g.lane")
            .data(eventDataCursor, (d)=>d._id) //use service as the key for data join
            .enter()
            .append("g")
            .attr("transform", (d, i)=>`translate(${4 + i * 10},0)`)
            .attr("class", "lane")
            .selectAll("circle")
            .data((d)=>d.items) // d is eventData[i]
            .enter();
        newEvts
            .append("circle")
            .attr("class","lifestreamEvt")
            .attr("clip-path","url(#lstrm-clip)")
            .attr("r", 4)
            .attr("cx", 10) //TODO what's with this? Seems like it should be 0.


        // Add extra stuff for events that have an end timestamp
        newEvts
            .append("line") // TODO should only be adding for events that have timestamp_end
            .attr({
                "class":"duration",
                "display":"none", // This is a hack... later we display only the ones with timestamp_end
                "clip-path":"url(#lstrm-clip)"
            });

        newEvts
            .append("circle")
            .attr({
                "class":"lifestreamEvtEnd",
                "clip-path":"url(#lstrm-clip)"
            });

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
        d3.select('body')
            .selectAll('div.ttp')
            .data([1])
            .enter()
            .append("div") //Makes sure there will always be exactly one tooltip div
            .style("position", "absolute")
            .style("z-index", "10")
            .attr("class","ttp");

        // Mouseovers setup
        let tooltipEl = d3.select("div.ttp");
        d3.selectAll(".lifestreamEvt, .lifestreamEvtEnd, .duration")
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
        this.panZoom = d3.behavior.zoom()
            .y(self.tscale)
            .on("zoom", ()=>this.updateAxes()); // Use => to preserve the "this" context
        this.panZoom(d3.select('svg.lifestream'));


    }

    updateAxes(start_end_times){
        let self = this;
        if (!!start_end_times){
            self.tscale.domain(start_end_times);
        };
        d3.selectAll('circle.lifestreamEvt')
            .attr("cy", (d)=>self.tscale(d.timestamp));
        d3.selectAll('line.duration')
            .filter((d)=>!!d.timestamp_end)
            .attr({
                x1:10,
                y1:(d)=>self.tscale(d.timestamp),
                x2:10,
                y2:(d)=>self.tscale(d.timestamp_end)})
            .attr("display","block");
        d3.selectAll('circle.lifestreamEvtEnd')
            .filter((d)=>d.timestamp_end)
            .attr({r: 4, cx:10, cy:(d)=>self.tscale(d.timestamp_end)});
        d3.selectAll('g.axis').call(self.ax);
        d3.selectAll('.tick text').attr('transform','rotate(-90)')
    }
    updateSelectionDisplay(){
        let selected = Session.get('lstrm-selected');
        if (selected) {
            d3.selectAll('circle.lifestreamEvt')
                .attr("style", (d)=> {
                    return (selected == d.orig_id)
                        ? "stroke: red; fill: red"
                        : "stroke: black; fill: black"
                });
            let timestamp = d3
                .selectAll('circle.lifestreamEvt')
                .filter((d)=>d.orig_id == Session.get('lstrm-selected'))
                .data()[0]
                .timestamp;
            if (timestamp) {
                let weekBefore = new Date(timestamp).setDate(timestamp.getDate() - 5);
                let weekAfter = new Date(timestamp).setDate(timestamp.getDate() + 5);
                this.updateAxes([new Date(weekBefore), new Date(weekAfter)]);
            }
        }
    }
}

Template.lifestream_timeline.onCreated(
    function(){
        this.timeline = new LifestreamTimeline();
    }
);
Template.registerHelper('drawLifestream',
    function(){
        let self = Template.instance();
        self.timeline.render(Lifestreams.find().fetch());
        self.timeline.updateAxes();
        self.timeline.updateSelectionDisplay();
        Session.get('lstrm-selected');
    }
);