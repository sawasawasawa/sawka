function drawSVG(limit) {
    //D3 program to fit circles of different sizes along a
    //horizontal dimension, shifting them up and down
    //vertically only as much as is necessary to make
    //them all fit without overlap.
    //By Amelia Bellamy-Royds, in response to
    //http://stackoverflow.com/questions/20912081/d3-js-circle-packing-along-a-line
    //inspired by
    //http://www.nytimes.com/interactive/2013/05/25/sunday-review/corporate-taxes.html
    //Freely released for any purpose under Creative Commons Attribution licence: http://creativecommons.org/licenses/by/3.0/
    //Author name and link to this page is sufficient attribution.
    var dataToInsert = rankingData["data"+limit];

    //x for x-position
    //r for radius; value will be proportional to area
//________________//

//Set up SVG and axis//
    var circleRadius = 30;
    var svg = d3.select("svg");
    var svgContainer = d3.select(".svgContainer");
    var defsContainer = svg.append("defs").attr("id", "defsContainer");
    var minHeight = 500;
    var maxHeight = Math.min(window.innerHeight, circleRadius * 2*10)
    var minWidth = 680;
    var svgHeight = Math.min(maxHeight,Math.max(window.innerHeight, minHeight));
    var svgWidth = Math.max(window.innerWidth, minWidth);
    var delayTime = 300;
    var durationTime = 5*300;

    if  (svgWidth === minWidth) {circleRadius=20;}
//create data array//
    dataToInsert = dataToInsert.sort(function(a,b){return a.uniqueCount - b.uniqueCount;});
    var data = [];
    var i = 0;
    var randNorm = d3.random.normal(0.5, 0.2);
    while (dataToInsert.length > i) {
        var info = dataToInsert[i];
        data.push({
            x: Math.round(info.uniqueCount/25)*25,
            x: Math.round(info.uniqueCount/1),
            r: (2*circleRadius) / 100,
            // r: info.tracks / 100,
            name: info.name,
            uniqueCount: info.uniqueCount,
            tracks: info.tracks
        });
        i++;
    }
    var maxXScale = Math.round(d3.max(data, function(d) { return d.uniqueCount; })/100)*100+275;
    var minXScale = Math.round(d3.min(data, function(d) { return d.uniqueCount; })/100)*100-200;
    svg.style("width", svgWidth + 'px')
        .style("height", svgHeight + 'px');
    var digits = /(\d*)/;
    var margin = 50; //space in pixels from edges of SVG
    var padding = 1; //space in pixels between circles
    var maxRadius = circleRadius+10;
    var biggestFirst = true; //should largest circles be added first?

    var width = window.getComputedStyle(svg[0][0])["width"];
    width = digits.exec(width)[0];
    var height = window.getComputedStyle(svg[0][0])["height"];
    height = Math.min(digits.exec(height)[0], width);

    var baselineHeight = (margin + height) / 2;

    var xScale = d3.scale.linear()
        .domain([minXScale, maxXScale])
        .range([margin, width - margin]);

    var rScale = d3.scale.sqrt()
    //make radius proportional to square root of data r
        .domain([0, 1])
        .range([1, maxRadius]);

    var formatPercent = d3.format(".0%");

    var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("top")
            .ticks(5)
        ;

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + margin + ")")
        .style('opacity', 0)
        .transition().delay(1).duration(3*durationTime)
        .style('opacity', 0.8)
        .call(xAxis);

    var threads = svg.append("g")
        .attr("class", "threads");


    var bubbleLine = svg.append("g")
        .attr("class", "bubbles")
        .attr("transform",
            "translate(0," + baselineHeight + ")");

    // bubbleLine.append("line")
    //     .attr("x1", xScale.range()[0])
    //     .attr("x2", xScale.range()[1]);
//________________//

    var range = maxXScale - minXScale;
    var numberOfVericalLines = Math.floor((range+200) / 500);
    var firstLineX = Math.round(minXScale / 500)*500;

    for (q = 0; q <= numberOfVericalLines; q++){
        var xValue = firstLineX + 500*q;
        if (xValue < maxXScale && xValue >= minXScale ) {
            threads.append("line").attr('id', 'verticalLine_' + q)
                .attr({x1: xScale(firstLineX + 500 * q), x2: xScale(firstLineX + 500 * q), y1: margin, y2: margin})
                .style('opacity', 0.2)
                .transition().delay(11 * delayTime).duration(2 * durationTime)
                .attr('y2', svgHeight)
            ;
        }
    }
//Create Quadtree to manage data conflicts & define functions//

    var quadtree = d3.geom.quadtree()
        .x(function (d) {
            return xScale(d.x);
        })
        .y(0) //constant, they are all on the same line
        .extent([[xScale(minXScale), 0], [xScale(maxXScale), 0]]);
    //extent sets the domain for the tree
    //using the format [[minX,minY],[maxX, maxY]]
    //optional if you're adding all the data at once

    var quadroot = quadtree([]);
    //create an empty adjacency tree;
    //the function returns the root node.

// Find the all nodes in the tree that overlap a given circle.
// quadroot is the root node of the tree, scaledX and scaledR
//are the position and dimensions of the circle on screen
//maxR is the (scaled) maximum radius of dots that have
//already been positioned.
//This will be most efficient if you add the circles
//starting with the smallest.
    function findNeighbours(root, scaledX, scaledR, maxR) {

        var neighbours = [];
        //console.log("Neighbours of " + scaledX + ", radius " + scaledR);

        root.visit(function (node, x1, y1, x2, y2) {
            //console.log("visiting (" + x1 + "," +x2+")");
            var p = node.point;
            if (p) {  //this node stores a data point value
                var overlap, x2 = xScale(p.x), r2 = rScale(p.r);
                if (x2 < scaledX) {
                    //the point is to the left of x
                    overlap = (x2 + r2 + padding >= scaledX - scaledR);
                    /*console.log("left:" + x2 + ", radius " + r2
                     + (overlap?" overlap": " clear"));//*/
                }
                else {
                    //the point is to the right
                    overlap = (scaledX + scaledR + padding >= x2 - r2);
                    /*console.log("right:" + x2 + ", radius " + r2
                     + (overlap?" overlap": " clear"));//*/
                }
                if (overlap) neighbours.push(p);
            }

            return (x1 - maxR > scaledX + scaledR + padding)
                && (x2 + maxR < scaledX - scaledR - padding);
            //Returns true if none of the points in this
            //section of the tree can overlap the point being
            //compared; a true return value tells the `visit()` method
            //not to bother searching the child sections of this tree
        });

        return neighbours;
    }

    function calculateOffset(maxR) {
        return function (d) {
            neighbours = findNeighbours(quadroot,
                xScale(d.x),
                rScale(d.r),
                maxR);
            var n = neighbours.length;
            //console.log(j + " neighbours");
            var upperEnd = 0, lowerEnd = 0;
            if (n) {
                //for every circle in the neighbour array
                // calculate how much farther above
                //or below this one has to be to not overlap;
                //keep track of the max values
                var j = n, occupied = new Array(n);
                while (j--) {
                    var p = neighbours[j];
                    var hypoteneuse = rScale(d.r) + rScale(p.r) + padding;
                    //length of line between center points, if only
                    // "padding" space in between circles

                    var base = xScale(d.x) - xScale(p.x);
                    // horizontal offset between centres

                    var vertical = Math.sqrt(Math.pow(hypoteneuse, 2) -
                        Math.pow(base, 2));
                    //Pythagorean theorem

                    occupied[j] = [p.offset + vertical,
                        p.offset - vertical];
                    //max and min of the zone occupied
                    //by this circle at x=xScale(d.x)
                }
                occupied = occupied.sort(
                    function (a, b) {
                        return a[0] - b[0];
                    });
                //sort by the max value of the occupied block
                //console.log(occupied);
                lowerEnd = upperEnd = 1 / 0;//infinity

                j = n;
                while (j--) {
                    //working from the end of the "occupied" array,
                    //i.e. the circle with highest positive blocking
                    //value:

                    if (lowerEnd > occupied[j][0]) {
                        //then there is space beyond this neighbour
                        //inside of all previous compared neighbours
                        upperEnd = Math.min(lowerEnd,
                            occupied[j][0]);
                        lowerEnd = occupied[j][1];
                    }
                    else {
                        lowerEnd = Math.min(lowerEnd,
                            occupied[j][1]);
                    }
                    //console.log("at " + formatPercent(d.x) + ": "
                    //          + upperEnd + "," + lowerEnd);
                }
            }

            //assign this circle the offset that is smaller
            //in magnitude:
            return d.offset =
                (Math.abs(upperEnd) < Math.abs(lowerEnd)) ?
                    upperEnd : lowerEnd;
        };
    }

    //Create circles!//
    var maxR = 0;

    // var delayTime = 0;
    // var durationTime = 0;

    bubbleLine.selectAll("circle")
        // .data(data.sort(
        //     biggestFirst ?
        //         function (a, b) {
        //             return b.r - a.r;
        //         } :
        //         function (a, b) {
        //             return a.r - b.r;
        //         }
        // ))
        .data(data.sort(function(a,b){return b.uniqueCount - a.uniqueCount;})
        // .data(data.sort(function(a,b){return a.name.length - b.name.length;})
        )
        .enter()
        .append("circle")
        .attr("r", function (d) {
            var r = rScale(d.r);
            maxR = Math.max(r, maxR);
            return r;
        })
        .attr("r", circleRadius)
        .each(function (d, i) {
            var _originalName = d.name;
            var scaledX = xScale(d.x);
            var name = d.name.toLowerCase()
                .replace(/\./g, '')
                .replace(/ł/g, 'l')
                .replace(/ó/g, 'o')
                .replace(/ę/g, 'e')
                .replace(/ /g, '-');
            var _fill = "url(#patt_"+name+")";

            //for each circle, calculate it's position
            //then add it to the quadtree
            //so the following circles will avoid it.

            d3.select(this)
                .attr("cx", scaledX)
                // .attr("cy", -baselineHeight + margin).transition().delay(((i/5-5)^2+i+20)).duration(3*durationTime)
                .attr("cy", -baselineHeight + margin)
                // .transition()
                // .delay(delayTime *i)
                // .duration(durationTime)
                // .ease("back")
                // ["linear", "quad", "cubic", "sin", "exp", "circle", "elastic", ]
                .transition().delay(1000+((i/5-5)^2+i+20)).duration(durationTime)
                // .style('visibility', 'visible')
                // .style('stroke', '#'+Math.random().toString(16).substr(-6))
                .style('opacity', '1')
                .attr("cy", calculateOffset(maxR))
                .style("fill",_fill)
                .transition().delay(5000).duration(durationTime)
                .style('opacity', '0.9');

            // defsContainer
            //     .append('pattern')
            //     .attr('id', 'patt_'+ name)
            //     .attr('patternUnits', 'objectBoundingBox')
            //     .attr('width', 2*circleRadius)
            //     .attr('height', 2*circleRadius)
            //     .attr("x", scaledX+circleRadius)
            //     .attr("y",d.offset+svgHeight+(circleRadius+12)/2 - margin)
            //     .append("image")
            //     .attr("xlink:href", "img/"+name+"_min.jpg")
            //     .attr('width', 60)
            //     .attr('height', 60);
            defsContainer
                .append('pattern')
                .attr('id', 'patt_'+ name)
                .attr('patternUnits', 'objectBoundingBox')
                .attr('width', 1)
                .attr('height', 1)
                .attr("x", Math.round(scaledX))
                .attr("y",Math.round(d.offset))
                .append("image")
                .attr("xlink:href", "img/"+name+"_min.jpg")
                .attr('width', circleRadius*2)
                .attr('height', circleRadius*2);

            d3.select(this).on("mouseenter", function(){
                console.log('mousenter on ', "#"+name);
                d3.select(this)
                    .transition().delay(2).duration(durationTime/2)
                    .style('opacity',1)
                    .transition().delay(delayTime).duration(2*durationTime)
                    .style('opacity',0.9);
                d3.select("#"+name)
                    .transition().delay(1).duration(10)
                    .style('opacity',1)
                    .transition().delay(1050).duration(durationTime/5)
                    .style('opacity',0);
                d3.select("#line_"+name)
                    .style('opacity',0.2)
                    .transition().delay(1).duration(10)
                    .attr("y1", (baselineHeight + d.offset))
                    .transition().delay(1050).duration(durationTime/5)
                    .attr("y1", (margin+25))
                    .style('opacity',1);
                d3.select("#"+name+"-info")
                    .transition().delay(1).duration(10)
                    .style('opacity',1)
                    .transition().delay(1050).duration(durationTime/5)
                    .style('opacity',0);
                d3.select("#"+name+"-info-bg")
                    .style('display', 'initial')
                    .transition().delay(1).duration(10)
                    .style('opacity',1)
                    .transition().delay(1050).duration(2*durationTime)
                    .style('opacity', 0)
                    .transition().delay(3000).duration(2*durationTime)
                    .style('display', 'none')
                    ;
            });

            d3.select(this).on("click", function(){
                console.log('click on ', "#"+name);
                d3.select(this)
                    .transition().delay(0).duration(durationTime/2)
                    .style('opacity',1)
                    .transition().delay(delayTime).duration(2*durationTime)
                    .style('opacity',0.9);
                d3.select("#"+name)
                    .transition().delay(1).duration(10)
                    .style('opacity',1)
                    .transition().delay(1050).duration(durationTime/5)
                    .style('opacity',0);
                d3.select("#line_"+name)
                    .style('opacity',0.2)
                    .transition().delay(1).duration(10)
                    .attr("y1", (baselineHeight + d.offset))
                    .transition().delay(1050).duration(durationTime/5)
                    .attr("y1", (margin+25))
                    .style('opacity',1);
                d3.select("#"+name+"-info")
                    .transition().delay(1).duration(10)
                    .style('opacity',1)
                    .transition().delay(1050).duration(durationTime/5)
                    .style('opacity',0);
                d3.select("#"+name+"-info-bg")
                    .style('display', 'initial')
                    .transition().delay(1).duration(10)
                    .style('opacity',1)
                    .transition().delay(1).duration(1*durationTime)
                    .style('opacity', 0)
                    .transition().delay(1).duration(2*durationTime)
                    .style('display', 'none')
                ;
            });

            // d3.select(this).on("mouseleave", function(){
            //     d3.select("#"+name+"-info-bg")
            //         .style('display', 'none');
            // });

            quadroot.add(d);

            circleRadius === 20 ? modifier = 10 : modifier = 0;

            var avgSignWidth = 13;

            bubbleLine.append("rect")
                .attr("id", name+"-info-bg")
                .attr("x", scaledX- name.length * avgSignWidth/2-10)
                .attr("y", d.offset+circleRadius-5)
                .attr("width", name.length * avgSignWidth+20)
                .attr("height", 43)
                .style('display', 'none')
                .attr('fill', 'lightgray');

            bubbleLine.append("text")
                .attr("id", name)
                .attr("x", scaledX)
                .attr("y", d.offset+circleRadius+10)
                .style('opacity', '0')
                .html(_originalName.toUpperCase())
                // // .transition().delay(200+delayTime * i-Math.random()*delayTime).duration(durationTime)
                // .transition().delay(1000+((i/5-5)^2+i+20)).duration(durationTime)
                // .style('opacity', '1')
                // .transition().delay(1000+((i/5-5)^2+i+20)+3000).duration(durationTime)
                .style('opacity', '0').style('z-index', '101');



            bubbleLine.append("text")
                .attr("id", name+"-info")
                .attr("x", scaledX)
                .attr("y", d.offset+55-modifier)
                .style('opacity', '0')
                .html(d.uniqueCount);





            // bubbleLine.append("text")
            //     .attr("x", scaledX)
            //     .attr("y", d.offset+20)
            //     .html(d.uniqueCount);



            //add a drop line from the centre of this
            //circle to the axis
            //
            threads.append("line").datum(d)
                .style('opacity', 0.3)
                .attr({x1: scaledX, x2: scaledX, y2: margin})
                .attr("y1", margin)
                // .transition().delay(delayTime * i).duration(durationTime)
                .transition().delay(1000+((i/5-5)^2+i+20)).duration(durationTime)
                .attr("y1", (baselineHeight + d.offset))
                // .transition().delay(delayTime * i+700).duration(durationTime)
                .transition().delay(1000+2000+((i/5-5)^2+i+20)).duration(1.5*durationTime)
                .style('opacity', 0.7)
                .attr("y1", margin +25)
                .attr("id", 'line_'+name )
            ;
        });


};
function changeLimit(limit){
    d3.select("svg")
        .html("")

    ;
    drawSVG(limit);
    document.getElementById('rangeValLabel').innerHTML = limit;
};
changeLimit(10000);
