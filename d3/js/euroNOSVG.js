


var goalData = [];
var goalBasket = d3.select('body')
    .append('div')
    .classed('goalBasket', true)
    .style('position', 'fixed')
    .style('top', '20px')
    .style('right', '20px')
    ;
var goalsInBasket = 0;
var spaceBetweenFlagsMiddle = 10;
var flagWidth = 80;
var flagHeight = Math.round((flagWidth / 3)) * 2;
var scaledMatchLength = flagHeight + 10;
var numberOfMatches = data.length;
var totalLength_SIMPLIFIED = numberOfMatches * (scaledMatchLength);
var maxHeight = window.innerHeight;
var minWidth = 680;
var myDivHeight = totalLength_SIMPLIFIED;
var myDivWidth = Math.max(window.innerWidth, minWidth);
var marginTop = 55;




var delayTime = 1;
var durationTime = 300;
var minHeight = 500;

var ballRadius = 15;
var matchLengthOnTimeline = 100;
var rectWidth = Math.round(2.1 * flagWidth / 5) * 5;

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
var myDiv = d3.select("#mainContainer");
var topContainerHeight = 70;
var topContainer = d3.select('#topContainer');
    topContainer.style('height',topContainerHeight+'px')
        .style('background-color','white')
        // .style('background', 'linear-gradient(green 70%, transparent )')
        .style('position','fixed')
        .style('top','0')
        .style('width','100%')
        .style('z-index','100')
    ;

var goalsContainer = topContainer.append('div')
    .attr('id','goalsContainer')
    .style('position','fixed')
    .style('top',0)
    .style('margin-top', marginTop+'px')
    .style('padding','20px')
    .style('width','100%')
  ;



myDiv.style("width", myDivWidth + 'px')
    .style("height", myDivHeight + 'px');

var divMiddleAbsolute = myDivWidth / 2;
var goalsDiv = d3.select('body')
        .append('div')
        .classed('goalsDiv', true)
        // .style('width', myDivWidth+'px')
        .style('height', myDivHeight + 'px')
    ;
var body = d3.select('body');
body.style('height', 3 * myDivHeight + 'px');


var yScale = d3.scale.linear()
    .domain([0, totalLength_SIMPLIFIED])
    .range([marginTop+topContainerHeight, topContainerHeight+myDivHeight - marginTop]);

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

var goalSvg = topContainer.append('div')
        .style('position', 'fixed')
        .style('left', divMiddleAbsolute-50+'px')
        .style('top', 0+'px')
        .style('width', 100+'px')
        .style('height', 80+'px')
        .style('background-image', "url('../d3/img/goal.svg')")
        .style('background-size', "cover")
        // .style('background-color', "black")
        .style('z-index', "10001")
    ;

function generateMsg(totalTimeStr, goalsInBasket){
    return '<h1 style="width:100%"><span>GOALS SCORED:'+goalsInBasket+'</span>'+
        '<span style="float:right; margin-right: 50px">TOTAL TIME: ' + totalTimeStr +'</span></h1>';
}

function drawFlags() {
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
                var className = _teams[j]
                var offset = j ? ballRadius + 10 : -flagWidth - ballRadius - 10;

                var cx = Math.round(divMiddleAbsolute + j * (flagWidth + spaceBetweenFlagsMiddle)) + offset;
                if (_teams[j] == 'Irlandia Północna') {
                    fill = 'url(#NorthernIreland)';
                    className = 'NorthernIreland'
                }
                //console.log(scaledY);
                myDiv
                    .append("div")
                    .classed(className, true)
                    .classed('rect', true)
                    .on("click", function () {
                        console.log(d);
                    })
                    .attr("id", _id)
                    .style('position', 'absolute')
                    .style('top', scaledY + 'px')
                    .style('left', offset * 1000 + 'px')
                    // .style('left', (myDivWidth/2 + j * (myDivWidth + 100)) + 'px')
                    .style('width', flagWidth + "px")
                    .style('height', flagHeight + "px")
                    .transition().delay(100 * i / 5).duration(250 * i / 2 + 500)
                    .style("left", divMiddleAbsolute + offset + 'px');

                // console.log(_teams[j])
                d3.select('#' + _id)
                    .append('div')
                    .style('position', 'relative')
                    .style('left', offset + flagWidth + (j - 1) * flagWidth + 'px')
                    .style('top', '20px')
                    .text(_teams[j])
                ;
            }
            d3.select(this).remove()
        });
    }

function drawBalls(){
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

        var _awayTeamScored = _describedMatch.away == d.team;
        var offset = _awayTeamScored ? ballRadius / 2 : -ballRadius - ballRadius / 2;
        d.scaledY = scaledY;
        d.xPosStarting = Math.round(divMiddleAbsolute + offset);
        d.xPosWhenFixedToTop = Math.round(xScale((d.matchNumber) * scaledMatchLength + Math.round(parseInt(d.timing) * scaledMatchLength / 130)));

        d3.select(this)
            .style('opacity', 0)
            .style("height", ballRadius+ 'px')
            .style("width", ballRadius+ 'px')
            .style("position", 'absolute')
            .style("left", (divMiddleAbsolute + 2000 * Math.sign(offset))+'px')
            .style("top", scaledY + 'px')
            .attr("id", i)
            .transition().delay(200 + 100 * d.matchNumber ).duration(250 * d.matchNumber / 2)
            .style("left", d.xPosStarting + 'px')
            .style("border-radius", "50%")
            .style("top", +scaledY + 'px')
            .style('opacity', '1')
            // .style('background', 'url(img/ball.svg)')
            .style('background-color', 'white')
        ;
        var cx_zero = Math.round(myDivWidth / 2 + scaledMatchLength * offset * (Math.random()));

        d3.select(this).on('click', function () {
            console.log(d)
        })
        ;

        // d3.select(this).on('mouseover', tip.show)
        // ;

    });
}

window.onscroll = function () {
    myFunction()
};

function myFunction() {
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

    if (scrollTop>myDivHeight +500) {
        myDiv.append('div').html('<h1>YOOOO</h1>')
    }else {
        goalsDiv.selectAll(".ball")
            .each(function (d, i) {
               
                var top = parseInt(d3.select(this).style('top').replace('px', ''));
                var position = d3.select(this).style('position');

                var totalTime = (d.matchNumber ? d.matchNumber - 1 : 0) * 90 + parseInt(d.timing);
                var minutes = totalTime % 60;
                var sixtyMinutes = d.timing > 60 ? 1 : 0;

                if (d.matchNumber == 0) {
                    console.log(d);
                    console.log('PINGWIN: top', top);
                    console.log('PINGWIN: position', position);
                    console.log('PINGWIN: d.matchNumber', d.matchNumber);
                    console.log('PINGWIN: d.timing', d.timing);
                    console.log('PINGWIN: totalTime', totalTime);
                    console.log('PINGWIN: sixtyMinutes', sixtyMinutes);
                    console.log('PINGWIN: minutes', minutes);
                }
                var minutesString = (parseInt(totalTime + d.timing - 60 * sixtyMinutes) % 60).toString() + ' m';
                var hoursString = Math.floor((totalTime - 60 * sixtyMinutes) / 60).toString() + ' h ';
                var totalTimeStr = hoursString + minutesString;
                var msg = '';
                if (d.scaledY < scrollTop + marginTop) {
                    if (position == 'absolute') {
                        goalsInBasket += 1;
                        msg = generateMsg(totalTimeStr, goalsInBasket);
                        goalsContainer.html(msg)
                    }

                    d3.select(this)
                        .style('position', 'fixed')
                        .style('top', marginTop + 'px')
                        .transition().delay(0).duration(300)
                        .style('left', d.xPosWhenFixedToTop + 'px')
                    ;

                } else if (position == 'fixed' && d.scaledY > top + marginTop) {
                    goalsInBasket -= 1;
                    msg = generateMsg(totalTimeStr, goalsInBasket);
                    goalsContainer.html(msg);

                    d3.select(this)
                        .style('position', 'absolute')
                        .style('top', d.scaledY + 'px')
                        .transition().delay(0).duration(500)
                        .style('left', d.xPosStarting + 'px')
                }
            })
        ;
    }
}

var matchAverages = d3.select('body')
    .append('div')
    .style('height', '800px')
    .style('background-color', 'yellow')
    .html('<h1>MATCH AVERAGES</h1>')
    .classed('match-averages', true);

window.onload = function () {
    setTimeout(function () {
        scrollTo(0, 0);
        drawFlags();
        drawBalls();
    }, 100); //100ms for example
}