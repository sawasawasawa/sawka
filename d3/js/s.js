Popular / About Justin Palmer’s Block 6476579 ← 3885304
Updated April 14, 2016
Using d3-tip to add tooltips to a d3 bar chart

Open
How to use d3-tip with d3's simple bar chart example.

index.html#

Using d3-tip to add tooltips to a d3 bar chart.
<!DOCTYPE html>
<meta charset="utf-8">
    <style>

    body {
    font: 10px sans-serif;
}

.axis path,
.axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
}

.bar {
    fill: orange;
}

.bar:hover {
    fill: orangered ;
}

.x.axis path {
    display: none;
}

.d3-tip {
    line-height: 1;
    font-weight: bold;
    padding: 12px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    border-radius: 2px;
}

/* Creates a small triangle extender for the tooltip */
.d3-tip:after {
    box-sizing: border-box;
    display: inline;
    font-size: 10px;
    width: 100%;
    line-height: 1;
    color: rgba(0, 0, 0, 0.8);
    content: "\25BC";
    position: absolute;
    text-align: center;
}

/* Style northward tooltips differently */
.d3-tip.n:after {
    margin: -1px 0 0 0;
    top: 100%;
    left: 0;
}
</style>
<body>
<script src="http://d3js.org/d3.v3.min.js"></script>
    <script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
    <script>

var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
    })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.tsv("data.tsv", type, function(error, data) {
    x.domain(data.map(function(d) { return d.letter; }));
    y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.letter); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.frequency); })
        .attr("height", function(d) { return height - y(d.frequency); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

});

function type(d) {
    d.frequency = +d.frequency;
    return d;
}

</script>
data.tsv#

letter	frequency
A	.08167
B	.01492
C	.02780
D	.04253
E	.12702
F	.02288
G	.02022
H	.06094
I	.06973
J	.00153
K	.00747
L	.04025
M	.02517
N	.06749
O	.07507
P	.01929
Q	.00098
R	.05987
S	.06333
T	.09056
U	.02758
V	.01037
W	.02465
X	.00150
Y	.01971
Z	.00074
LICENSE#

This block appears to have no license. Please contact the author to request a license./**
 * Created by ewa on 2016-07-12.
 */
