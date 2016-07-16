var svg = d3.select("svg");
var _width = window.innerWidth;
var _height = window.innerHeight;
svg.attr('width', _width)
    .attr('height', _height);
var g = svg.append("g");
var _dataset = [];

var _animationLength=5000;
var _counter = 500;
var _singleAnimation = _animationLength/_counter;

columns = [];
for (i=0; i<_width;i+=10){
    columns.push([i])
}
console.log(columns.length);
for (i=0; i<_height;i+=10){
    for (j=0;j<columns.length;j+=1){
        _dataset.push([i, 10*j])
    }
}
console.log(_dataset.length/columns.length);
// while (_counter){
//     _dataset.push(_counter);
//     _counter --;
// }
console.log('elo');
g.selectAll('rect').data(_dataset)
    .enter()
    .append('rect')
    .each(function (d){

        d3.select(this)
            .attr("id", d[0]+"_"+d[1])
            .attr("x", d[1])
            .attr("y", d[0])
            .attr("width", 10)
            .attr("height", 10)
            .attr('fill', 'lightgray')
            .transition().delay(d[0]*10-Math.round(Math.random()*500)).duration(50)
            .attr('fill', 'orange')
            .style('opacity', 0.3)
            .transition().delay(2*d[0]*10-Math.round(Math.random()*500)).duration(50)
            .attr('fill', 'blue')
            .style('opacity', 0.3)
    })
;
d3.selectAll("rect")
    .on("mouseenter", function() {
            console.log('mousenter on ', "#" + name);
            d3.select(this)
                .transition().delay(0).duration(_singleAnimation)
                .style('opacity', 0.1)
                .transition().delay(2000).duration(2000)
                .style('fill','orange')
                .style('opacity', 0.7);
        });

//======================================
//painting grid with lines
//
// var _verticalGridLinesCounter = 0;
// var _horizontalGridLinesCounter = 0;
// while (_verticalGridLinesCounter<_width){
//     console.log(_verticalGridLinesCounter);
//     g.append("line")
//         .style('opacity', 0.3)
//         .attr({x1: _verticalGridLinesCounter, x2: _verticalGridLinesCounter, y2: 0, y1:0})
//         .transition().delay(3*_verticalGridLinesCounter).duration(2000)
//         .style('opacity', 0.7)
//         .attr("y1", _height)
//         .attr("id", 'line_'+_verticalGridLinesCounter );
//     _verticalGridLinesCounter += 10;
// };
//
// var _horizontalGridLinesCounter = 0;
// while (_horizontalGridLinesCounter<_width){
//     console.log(_horizontalGridLinesCounter);
//     g.append("line")
//         .style('opacity', 0.3)
//         .attr({x1: 0, x2: 0, y2: _horizontalGridLinesCounter, y1:_horizontalGridLinesCounter})
//         .transition().delay(3*_horizontalGridLinesCounter).duration(1000)
//         .style('opacity', 0.7)
//         .attr("x2", _width)
//         .attr("id", 'line_'+_horizontalGridLinesCounter );
//     _horizontalGridLinesCounter += 10;
// };
//
// d3.selectAll("line")
//     .on("mouseenter", function() {
//             console.log('mousenter on ', "#" + name);
//             d3.select(this)
//                 .transition().delay(1).duration(_singleAnimation)
//                 .style('opacity', 0.1)
//                 .transition().delay(2000).duration(2000)
//                 .style('fill','orange')
//                 .style('opacity', 0.7);
//         });


//=============================================================================
//random circles
//
// g.selectAll("line")
//     .append("line")
//     .style('opacity', 0.3)
//     .attr({x1: scaledX, x2: scaledX, y2: margin})
//     .attr("y1", margin)
//     // .transition().delay(delayTime * i).duration(durationTime)
//     .transition().delay(1000+((i/5-5)^2+i+20)).duration(durationTime)
//     .attr("y1", (baselineHeight + d.offset))
//     // .transition().delay(delayTime * i+700).duration(durationTime)
//     .transition().delay(1000+2000+((i/5-5)^2+i+20)).duration(1.5*durationTime)
//     .style('opacity', 0.7)
//     .attr("y1", margin +25)
//     .attr("id", 'line_'+name )
//
//     .data(_dataset)
//     .enter()
//     .append("line")
//     .attr("r", 10)
//     .each(function(d){
//         console.log(_singleAnimation);
//         console.log(p1);
//         console.log(p2);
//         d3.select(this)
//             .style('opacity', 0)
//             .classed(p1)
//             .classed(p2)
//             .attr("cx", Math.round(Math.random()*_width))
//             .attr("cy", Math.round(Math.random()*_height))
//             .transition().delay(_singleAnimation*d).duration(1000)
//             .style('opacity', 1)
//             .transition().delay(_singleAnimation*d/2).duration(1000)
//             .style('opacity', 0.5)
//         ;
//
//         d3.select(this).on("mouseenter", function() {
//             console.log('mousenter on ', "#" + name);
//             d3.select(this)
//                 .transition().delay(1).duration(_singleAnimation)
//                 .style('opacity', 1)
//                 .transition().delay(2000).duration(2000)
//                 .style('opacity', 0.1);
//         });
//
//         if (p1) {p2=p1}
//         p1=d;
//     })
// ;
//
// var p1, p2;
//
// g.selectAll("circle")
//     .data(_dataset)
//     .enter()
//     .append("circle")
//     .attr("r", 10)
//     .each(function(d){
//         console.log(_singleAnimation);
//         console.log(p1);
//         console.log(p2);
//         d3.select(this)
//             .style('opacity', 0)
//             .classed(p1)
//             .classed(p2)
//             .attr("cx", Math.round(Math.random()*_width))
//             .attr("cy", Math.round(Math.random()*_height))
//             .transition().delay(_singleAnimation*d).duration(1000)
//             .style('opacity', 1)
//             .transition().delay(_singleAnimation*d/2).duration(1000)
//             .style('opacity', 0.5)
//         ;
//
//         d3.select(this).on("mouseenter", function() {
//             console.log('mousenter on ', "#" + name);
//             d3.select(this)
//                 .transition().delay(1).duration(_singleAnimation)
//                 .style('opacity', 1)
//                 .transition().delay(2000).duration(2000)
//                 .style('opacity', 0.1);
//         });
//
//         if (p1) {p2=p1}
//         p1=d;
//     })
// ;
// g.append('text')
//     .attr("id", 'text')
//     .attr("x", 100)
//     .attr("y", 100)
//     .style('opacity', '1')
//     .html('ELOO')
// ;

