var showingAverages =  false;
var prevScrollPos = window.scrollY;
var histogram = false ;

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
data = _.sortBy(data, function(o) {

    var dateArr = o.date.split(".");
    var date = new Date(parseInt(dateArr[2], 10),
        parseInt(dateArr[1], 10) - 1,
        parseInt(dateArr[0], 10));
    return date; })
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
var goalsDiv = d3.select('#mainContainer')
        .append('div')
        .classed('goalsDiv', true)
        // .style('width', myDivWidth+'px')
        .style('height', myDivHeight + 'px')
    ;
var body = d3.select('body');
body.style('height', 3 * myDivHeight + 'px');


var yScale = d3.scaleLinear()
    .domain([0, totalLength_SIMPLIFIED])
    .range([marginTop+topContainerHeight, topContainerHeight+myDivHeight - marginTop]);

var xScale = d3.scaleLinear()
    .domain([0, totalLength_SIMPLIFIED])
    .range([marginTop, myDivWidth - marginTop]);

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
    var allMatches = myDiv.append('div').attr('id', 'allMatches').style('position','absolute')
        .style('top',2*window.innerHeight+'px')
        .style('margin-top', marginTop+'px');

    allMatches
        .selectAll("div.flag")
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
                    // .transition().delay(100 * i / 5).duration(250 * i / 2 + 500)
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
            // .transition().delay(200 + 100 * d.matchNumber ).duration(250 * d.matchNumber / 2)
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
var srollIndicator =  d3.select('body').append('div')
    .attr('id', 'scrollIndicator)')
    .style('position','fixed')
    .style('top','500px')
    .style('left','100px');
var lastScrollAction = '';
var activeSlide = '';

function renderTitle(){
    d3.select('#mainContainer')
        .append('div')
        .attr('id', 'title')
        .classed('activeSlide', true)
        .style('position','absolute')
        .style('top',window.innerHeight/2+'px')
        .style('font-size','3em')
        .style('left','200px')
        .html('<h1>EURO 2016 GOALS</h1>');
};
function stickTitle(){
    d3.select('#title')
        .classed('activeSlide', false)
        // .transition().delay(1).duration(1000)
        .style('position','absolute')
        .style('top',window.innerHeight/2+'px')
        ;
};
function drawFirstMatch(){

}
var slides_down = {
    title: window.innerHeight,
    firstMatch: 2*window.innerHeight,
    firstMatchTimeline: 2*window.innerHeight,
    firstMatchMinimize: 2.5*window.innerHeight,
    allMatches: 2.5*window.innerHeight + myDivWidth,
    histogram: 3.5*window.innerHeight + myDivWidth,
    griezmann: 3.5*window.innerHeight + myDivWidth

}
var slides = {
    title: window.innerHeight,
    firstMatch: 2*window.innerHeight,
    firstMatchTimeline: 2*window.innerHeight,
    firstMatchMinimize: 2.5*window.innerHeight,
    allMatches: 2.5*window.innerHeight + myDivWidth,
    histogram: 3.5*window.innerHeight + myDivWidth,
    griezmann: 3.5*window.innerHeight + myDivWidth

}
if (!document.getElementById('title')){
    renderTitle();
}
window.onscroll = function () {
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    var scrollDown = Math.sign(window.scrollY-prevScrollPos) >=0 ? 1 :0;
    prevScrollPos = scrollTop;

    if (scrollDown){
        if (scrollTop<slides.title){

        }
        if (scrollTop>slides.title){
            if (!document.getElementById('allMatches')) {
                drawFlags();
                drawBalls();
            }
        }

    }

    srollIndicator.html('<h1>scrollTop: '+Math.round(scrollTop)+'</h1>');

    // if (scrollTop<myDivHeight){
    //     ballsTransitionMiddleTop(scrollTop);
    //     goalsDiv.classed('hist', false);
    // }
    // if (scrollTop<myDivHeight+500 && goalsDiv.classed('hist') ){
    //     moveBallsTop()
    //     goalsDiv.classed('hist', false);
    //     d3.select('#histAxis').remove();
    // }
    // if (scrollTop>myDivHeight +500 && !goalsDiv.classed('hist')){
    //     drawHistogramFromBalls();
    // }
    // if (scrollTop>myDivHeight +1500){
    //     griezmann();
    // }
};
var bestScorers ={};
dataModified = _.each(goalData, function (g){
          var scorer = g.player.replace(/\(.*\)/i, '').trim();
    console.log('___-> scorer', scorer);
    console.log('___-> bestScorers.hasOwnProperty(scorer)', bestScorers.hasOwnProperty('"'+scorer+'"'));
    console.log('___-> bestScorers[scorer]', bestScorers['"'+scorer+'"']);
    bestScorers.hasOwnProperty('"'+scorer+'"')? bestScorers['"'+scorer+'"'] +=1: bestScorers['"'+scorer+'"'] =1  ;
        // bestScorers[scorer] ? bestScorers.scorer +=1 : 1;
    console.log('___-> bestScorers[scorer]', bestScorers['"'+scorer+'"']);

});
    console.log('___-> bestScorers', bestScorers);
// allScorers = _.unique(goalData, "player", function(f){});
// console.log('___-> allScorers', allScorers);
//
// function griezmann() {
//     console.log('___-> griezmann');
//     goalsDiv.selectAll(".ball")
//         .each(function (d, i) {
//             d3.select(this)
//                 .classed('timeline-top', true)
//                 .transition().delay(1).duration(500)
//                 .style('width', '15px')
//                 .style('height', '15px')
//                 .style('top', marginTop + 'px')
//                 .style('left', d.xPosWhenFixedToTop + 'px')
//
//             ;
//         });
// }


function drawHistogram() {
    var x_avg = d3.scaleLinear()
        .domain([0, 120])
        .range([0, myDivWidth]);

    var binsData = _.map(goalData, function (d) {
            return parseInt(d.timing)
        }
    );

    var bins = d3.histogram()
        .domain(x_avg.domain())
        .thresholds(x_avg.ticks(10))
        (binsData);
    var y_avg = d3.scaleLinear()
        .domain([0, d3.max(binsData, function (d) {
            return d;
        })])
        .range([0, myDivHeight / 2 + marginTop]);

    var svg_avg = myDiv.append("svg")
        .attr("id", 'svg_avg')
        .style("position", 'fixed')
        .style("top", 0+'px')
        .style("left", 0+'px')
        .style("z-index", '10001')
        .attr("width", myDivWidth + 2 * marginTop)
        .attr("height", window.innerHeight / 2 + marginTop)
        .append("g")
        .attr("transform", "translate(" + marginTop + "," + marginTop + ")");
    var bar_avg = svg_avg.selectAll(".bar")
        .data(bins)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function (d) {
            return "translate(" + Math.round(x_avg(d.x0)) + "," + Math.round(window.innerHeight / 2 - y_avg(d.length)) + ")";
        })
        ;

    bar_avg.append("rect")
        .attr("x", 1)
        .attr("width", x_avg(bins[0].x1) - x_avg(bins[0].x0) - 1)
        .attr("height", function (d) {
            return y_avg(d.length);
        });

    bar_avg.append("text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .attr("x", (x_avg(bins[0].x1) - x_avg(bins[0].x0)) / 2)
        .attr("text-anchor", "middle")
        .text(function (d) {
            return d.length;
        });

    svg_avg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + window.innerHeight / 2 + ")")
        .call(d3.axisBottom(x_avg));

    goalsDiv.selectAll(".ball")
        .each(function (d, i) {
            d3.select(this)
                .style('position', 'fixed')
                .transition().delay(0).duration(500)
                .style('top', window.innerHeight / 2 + 'px')
                .style('left', d.xPosWhenFixedToTop + 'px')
            ;

        });
    showingAverages= true;
}
function drawHistogramFromBalls(){
    var histogramData = {   10:0,20:0, 30:0,40:0,50:0,60:0,70:0,80:0,90:0,100:0,110:0,120:0   };
    var usedData = {   10:0,20:0, 30:0,40:0,50:0,60:0,70:0,80:0,90:0,100:0,110:0,120:0   };
    // console.log('___-> histogramData', histogramData);
    _.each(goalData, function(goal){
        var goalTenMin = Math.floor(parseInt(goal.timing)/10+1)*10;
        histogramData[goalTenMin]+=1
    });
    histBallRadius=30;
    goalsDiv.classed('hist', true);
    console.log('___-> drawHistogramFromBalls');
    d3.selectAll('.ball')
        .each(function (d, i) {
            var goalTenMin =Math.floor(parseInt(d.timing)/10+1)*10;
            histX = window.innerWidth/2-12*histBallRadius+2*histBallRadius*goalTenMin/10;
            histY = window.innerHeight/2-1*histBallRadius*usedData[goalTenMin];
            d3.select(this)
                .classed('hist', true)
                .classed('timeline-top', false)
                .transition().delay(1).duration(500)
                .style('top', histY + 'px')
                .style('left', histX + 'px')
                .style('width', histBallRadius+ 'px')
                .style('height', histBallRadius+ 'px')
            ;
            usedData[goalTenMin] +=1;
        });

    var histAxis = goalsDiv.append('div')
        .attr('id', 'histAxis')
        .style('position', 'fixed')
        .style('top', window.innerHeight/2 + histBallRadius+'px')
        .style('left', 0 + 'px')
        // .style('left', window.innerWidth/2-12*histBallRadius + 'px')
        .style('width',  '100%')
        .style('height', 3*histBallRadius+ 'px')
        .style('background', 'yellow');

    histAxis.selectAll('div').data(d3.range(12)).enter().append('div').each(function(d, i){
        d3.select(this).style('background', 'green') .style('position', 'fixed').style('top', window.innerHeight/2+20 + 'px')
            .style('left', window.innerWidth/2-12*histBallRadius +(i+1/2)*2*histBallRadius +'px')
            .style('font-size',  '18px')
            .style('top',  window.innerHeight/2+50+'px')
            .style('color',  'white')
            .style('width',  '20px')
            .style('height', 3*histBallRadius+ 'px')
            .html(d)
    })
        ;
    updateGoalsContainer();
}
function ballsTransitionMiddleTop(scrollTop, scrollDown) {
console.log('___-> ballsTransitionMiddleTop');
    goalsDiv.selectAll(".ball")
        .each(function (d, i) {

            var top = parseInt(d3.select(this).style('top').replace('px', ''));
            var position = d3.select(this).style('position');

            var totalTime = (d.matchNumber ) * 90 + parseInt(d.timing);

            var msg = 'EMPTY?';
            //    GO TOP
            if (d.scaledY < scrollTop + marginTop) {
                if (!d3.select(this).classed('timeline-top')&& !d3.select(this).classed('hist')) {
                    goalsInBasket += 1;
                    d3.select(this).classed('timeline-top', true);
                    updateGoalsContainer(totalTime, goalsInBasket);
                }
                d3.select(this)
                        .style('position', 'fixed')
                        .style('top', marginTop + 'px')
                        .transition().delay(0).duration(500)
                         .style('left', d.xPosWhenFixedToTop + 'px');

            }
                //   GO MIDDLE
            else if (d.scaledY > top + marginTop) {
                if (d3.select(this).classed('timeline-top')){
                    goalsInBasket -= 1;
                    d3.select(this).classed('timeline-top', false);
                    updateGoalsContainer(totalTime, goalsInBasket);
                }

                d3.select(this)
                    .style('position', 'absolute')
                    .style('top', d.scaledY + 'px')
                    .transition().delay(0).duration(500)
                    .style('left', d.xPosStarting + 'px')
            }

        })
    ;
}

function updateGoalsContainer(totalTime, goalsInBasket){

    var minutes = totalTime % 60;
    var minutesString = minutes.toString() + ' m';
    var hoursString = Math.floor((totalTime ) / 60).toString() + ' h ';
    if (totalTime) {
        var totalTimeStr = hoursString + minutesString;
        msg = generateMsg(totalTimeStr, goalsInBasket);
    }else {msg = generateMsg(numberOfMatches*90, goalData.length)}

    goalsContainer.html(msg);}
function moveBallsTop() {
    console.log('___-> moveBallstop');
    goalsDiv.selectAll(".ball")
        .each(function (d, i) {
            d3.select(this)
                .classed('hist', false)
                .classed('timeline-top', true)
                .transition().delay(1).duration(500)
                .style('width', '15px')
                .style('height', '15px')
                .style('top', marginTop + 'px')
                .style('left', d.xPosWhenFixedToTop + 'px')

            ;
        });
}

// var matchAverages = d3.select('body')
//     .append('div')
//     .style('height', '800px')
//     .style('background-color', 'yellow')
//     .html('<h1>MATCH AVERAGES</h1>')
//     .classed('match-averages', true);

window.onload = function () {
    setTimeout(function () {
        scrollTo(0, 0);
        // drawFlags();
        // drawBalls();
    }, 100); //100ms for example
}

