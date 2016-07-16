var goalData = [];
var goalBasket = d3.select('body')
    .append('div')
    .classed('goalBasket', true)
    .style('position', 'fixed')
    .style('top', '20px')
    .style('right', '20px')
    .html('a');
var goalsInBasket = 0;


data = _.sortBy(data, "date");
teams = _.unique(data, false, 'home');


data = _.each(data, function (d, i) {
    data[i].matchNumber = i;
});
for (i = 0; i < data.length; i++) {
    var goals = data[i].goals;


    for (k = 0; k < goals.length; k++) {
        var goalInfo = goals[k];
        goalInfo.matchId = data[i].matchId;
        goalInfo.matchNumber = data[i].matchNumber;
        goalData.push(goalInfo)
    }
}
var myDiv = d3.select("#graph2");

var spaceBetweenFlagsMiddle = 10;
var spaceBetweenFlagsVertical = 20;
var flagWidth = 80;
var flagHeight = Math.round(flagWidth / 10) * 6;
var scaledMatchLength = flagHeight + 10;
var numberOfMatches = data.length;
var totalLength_SIMPLIFIED = numberOfMatches * (flagHeight + spaceBetweenFlagsVertical);
var maxHeight = window.innerHeight;
var minWidth = 680;
// var myDivHeight = Math.min(maxHeight,Math.max(window.innerHeight, minHeight));
var myDivHeight = totalLength_SIMPLIFIED;
var myDivWidth = Math.max(window.innerWidth, minWidth);
var margin = maxHeight / 2 - 150;
var marginTop = 25;

var delayTime = 1;
var durationTime = 300;
var minHeight = 500;

var ballRadius = 10;
var matchLengthOnTimeline = 100;
var rectWidth = Math.round(2.1 * flagWidth / 5) * 5;


myDiv.style("width", myDivWidth + 'px')
    .style("height", myDivHeight + 'px');
console.log(myDivHeight);

var goalsDiv = d3.select('body')
        .append('div')
        .classed('goalsDiv', true)
        // .style('width', myDivWidth+'px')
        .style('height', myDivHeight + 'px')
    ;
var body = d3.select('body');
body.style('height', 3 * myDivHeight + 'px');
console.log(myDiv.style('height'));
console.log(goalsDiv.style('height'));


var yScale = d3.scale.linear()
    .domain([0, totalLength_SIMPLIFIED])
    .range([marginTop, myDivHeight - marginTop]);

var xScale = d3.scale.linear()
    .domain([0, totalLength_SIMPLIFIED])
    .range([marginTop, myDivWidth - marginTop]);

// var yAxis = d3.myDiv.axis()
//     .scale(yScale)
//     .orient("left")
//     .ticks(10);

// myDiv.append("g")
//     .attr("class", "y axis")
// //     .attr("transform", "translate(0," + marginTop + ")")
//     .call(yAxis);

// var tip = d3.tip()
//     .attr('class', 'd3-tip')
//     .offset([10, 50])
//     .html(function(d) {
//         return d.timing +" minuta </br>" +
//             "<strong>Strzelec:</strong> <span style='color:red'>" + d.player + "</span></br>"+
//                 "<strong>Asysta:</strong> <span style='color:red'>" + d.assist + "</span></br>";
//     })
//
// myDiv.call(tip);

myDiv.selectAll("div")
    .data(data)
    .enter()
    .append("div")
    .each(function (d, i) {
        var _teams = [d.home, d.away];
        var scaledY = Math.round(yScale((d.matchNumber) * scaledMatchLength));/// aka timeFromStart


        for (j = 0; j < 2; j++) {
            var _id = 'id' + (_teams[j] + d.date).replace(/\./g, '').replace(/ /g, '').replace(/:/g, '');
            var fill = 'url(#' + _teams[j] + ')';
            var offset = j ? 20 : -20;
            var cx = Math.round(margin + j * (flagWidth + spaceBetweenFlagsMiddle)) + offset;
            if (_teams[j] == 'Irlandia Północna') {
                fill = 'url(#NorthernIreland)'
            }
            //console.log(scaledY);
            myDiv
                .append("div")
                .classed(_teams[j], true)
                .classed('rect', true)
                .on("click", function () {
                    console.log(d);
                })
                .attr("id", _id)
                .style('position', 'absolute')
                .style('top', scaledY + 'px')
                .style('left', (200 + j * (myDivWidth + 100)) + 'px')
                .style('width', flagWidth + "px")
                .style('height', flagHeight + "px")
                // .style('background-color', 'yellow')

                .transition().delay(100 * i / 5).duration(250 * i / 2 + 500)
            // .attr("top", scaledY)
                .style("left", cx + 'px')

            // console.log(_teams[j])
            d3.select('#' + _id)
                .append('div')
                .style('position', 'relative')
                .style('left', 40 + 6 * offset + 'px')
                .style('top', '40px')
                .text(_teams[j])
            ;
        }
        d3.select(this).remove()
    });

goalsDiv.selectAll("div")
    .data(goalData)
    .enter()
    .append("div")
    .classed("ball", true)
    .each(function (d, i) {
        var scaledY = Math.round(yScale((d.matchNumber) * scaledMatchLength + 5 + parseInt(d.timing) * scaledMatchLength / 130)); /// aka timeFromStart
        var _describedMatch = _.find(data, function (dd) {
            return d.matchId == dd.matchId
        });

        var _awayTeamScored = _describedMatch.home == d.team;
        var offset = _awayTeamScored ? -10 : 10;
        d.scaledY = scaledY;
        d.xPosStarting = Math.round(margin + rectWidth / 2 + offset);
        d.xPosWhenFixedToTop = Math.round(xScale((d.matchNumber) * scaledMatchLength + Math.round(parseInt(d.timing) * scaledMatchLength / 130)));

        d3.select(this)
            .style('opacity', 0)
            .style("height", '10px')
            .style("width", '10px')
            .style("position", 'absolute')
            .style("left", 100 + 300 * offset)
            .style("top", goalsDiv.style('top') + (scaledY) + 'px')
            .attr("id", i)
            .transition().delay(200 + 100 * d.matchNumber / 5).duration(250 * d.matchNumber / 2)
            .style("left", d.xPosStarting + 'px')
            .style("border-radius", "50%")
            .style("top", +scaledY + 'px')

            .style('opacity', '1')
            // .style('background', 'url(img/ball.svg)')
            .style('background-color', 'black')


        // .style("fill",_fill)
        ;
        var cx_zero = Math.round(myDivWidth / 2 + scaledMatchLength * offset * (Math.random()));

        d3.select(this).on('click', function () {
            console.log(d)
        })
        ;

        // d3.select(this).on('mouseover', tip.show)
        // ;

    });


window.onscroll = function () {
    myFunction()
};

function myFunction() {
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    // console.log('____________________scrollTop');
    // console.log(scrollTop);
    // console.log(myDiv.selectAll("circle"));

    goalsDiv.selectAll(".ball")
        .each(function (d, i) {
            var styleCssText = this.style.cssText;
            var css = {};
            _.each(styleCssText.split(';'), function (w) {
                var keyValue = w.split(': ');
                var myKey = '"' + keyValue[0].trim() + '"';
                if (keyValue.length == 2) {
                    var myValue = keyValue[1].replace('px', '').trim();
                    var valueIsNumber = !isNaN(parseInt(myValue));
                    if (valueIsNumber) {
                        css[myKey] = parseInt(Math.round(myValue));
                    } else {
                        css[myKey] = myValue;
                    }
                }
            });

            if (d.scaledY < scrollTop + marginTop) {
                if (d3.select(this).style("position") == 'absolute') {
                    goalsInBasket += 1;
                    d3.select('.goalBasket')
                        .html(goalsInBasket)
                }

                d3.select(this)
                    .style('position', 'fixed')
                    .style('top', '20px')
                    .transition().delay(0).duration(500)
                    .style('left', d.xPosWhenFixedToTop + 'px')
                ;

            } else if (css['"position"'] == 'fixed' && d.scaledY > css['"top"'] + marginTop) {
                goalsInBasket -=1;
                d3.select('.goalBasket')
                    .html(goalsInBasket)

                d3.select(this)
                    .style('position', 'absolute')
                    .style('top', d.scaledY + 'px')
                    .transition().delay(0).duration(500)
                    .style('left', d.xPosStarting + 'px')
            }
        })
    ;
}

var matchAverages = d3.select('body')
    .append('div')
    .style('height', '800px')
    .style('background-color', 'yellow')
    .html('<h1>MATCH AVERAGES</h1>')
    .classed('match-averages', true);