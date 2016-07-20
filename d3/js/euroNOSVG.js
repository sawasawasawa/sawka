scrollTo(0, 0);
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
var topContainerHeight = 100;
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
    .style('opacity','0')
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
        .attr('id', 'goalnet')
        .style('position', 'fixed')
        .style('width', 100+'px')
        .style('height', 80+'px')
        .style('left', divMiddleAbsolute-50+'px')
        .style('bottom', 0+'px')
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
                var className = _teams[j];
                var offset = j ? ballRadius + 10 : -flagWidth - ballRadius - 10;

                var cx = Math.round(divMiddleAbsolute + j * (flagWidth + spaceBetweenFlagsMiddle)) + offset;
                if (_teams[j] == 'Irlandia Północna') {
                    fill = 'url(#NorthernIreland)';
                    className = 'NorthernIreland'
                }
                //console.log(scaledY);
                allMatches
                    .append("div")
                    .classed(className, true)
                    .classed('rect', true)
                    .on("click", function () {
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
    // flagStartingHeight=
    .data(goalData)
    .enter()
    .append("div")
    .classed("ball", true)
    .each(function (d, i) {
        var scaledY = 2*window.innerHeight+marginTop+Math.round(yScale((d.matchNumber) * scaledMatchLength + 5 + parseInt(d.timing) * scaledMatchLength / 130)); /// aka timeFromStart
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
        .style('top',window.innerHeight-300+'px')
        .style('font-size','3em')
        .style('width','100%')
        .style('text-align','center')
        .html('<h1>EURO 2016 GOALS</h1>');
};

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
    allMatches: 2.5*window.innerHeight + myDivHeight,
    histogram: 3.5*window.innerHeight + myDivHeight,
    griezmann: 3.5*window.innerHeight + myDivHeight

}
if (!document.getElementById('title')){
    renderTitle();
}


if (!document.getElementById('allMatches')) {
    drawFlags();
    drawBalls();
}
window.onscroll = function () {
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    scrollTop=Math.round(scrollTop);
    var scrollDown = Math.sign(window.scrollY-prevScrollPos) >=0 ? 1 :0;
    prevScrollPos = scrollTop;

    if (scrollDown){
        if (scrollTop<slides.title){
           d3.select('#goalnet').style('top', window.innerHeight-scrollTop+'px');
            goalsContainer.transition().delay(1).duration(1000).style('opacity', '0');
        }else if (scrollTop<slides.allMatches){
            d3.select('#goalnet').style('top', 0+'px');
            ballsTransitionMiddleTop(scrollTop);
        }
        if (scrollTop>slides.firstMatchMinimize ){
            goalsContainer.style('opacity', '1');
        }
        if (scrollTop>slides.allMatches ){
            drawHistogramFromBalls();
        }
        if (scrollTop>slides.histogram ){
            d3.select('#histAxis')
                .transition().delay(1).duration(1000)
                .style('opacity', '0')
                .transition().delay(1000).duration(1)
                .style('display', 'none');
            goalsContainer.transition().delay(1).duration(1000).style('opacity', '0');
            griezmann();
        }

    } else {
        if (scrollTop<slides.title){
            d3.select(goalsContainer).style('opacity', '0').transition().delay(1).duration(1000);
            d3.select('#goalnet').style('top', window.innerHeight-scrollTop+'px');
        }
        if (scrollTop<slides.allMatches){
            ballsTransitionMiddleTop(scrollTop);
            d3.selectAll('.ball').classed('hist', false);
            d3.select('#histAxis')
                .transition().delay(1).duration(1000)
                .style('opacity', '0')
                .transition().delay(1000).duration(1)
                .style('display', 'none');
        }
        if (scrollTop<slides.griezmann &&  scrollTop > slides.allMatches) {
            d3.select('#histAxis')
                .transition().delay(1).duration(1000)
                .style('opacity', '1')
                .transition().delay(1000).duration(1)
                .style('display', 'initial');
            drawHistogramFromBalls();
            d3.select('#scorersNames')
                .transition().delay(1).duration(1000)
                .style('opacity', '0')
                .transition().delay(1000).duration(1)
                .style('display', 'none');


        }
    if (scrollTop<slides.allMatches+500 ) {
            moveBallsTop();


        }
    }

    // srollIndicator.html('<h1>scrollTop: '+Math.round(scrollTop)+'</h1>');
};
var bestScorers ={};

dataModified = _.each(goalData, function (g){
          var scorer = g.player.replace(/\(.*\)/i, '').trim();
    // console.log('___-> scorer', scorer);
    // console.log('___-> bestScorers.hasOwnProperty(scorer)', bestScorers.hasOwnProperty('"'+scorer+'"'));
    // console.log('___-> bestScorers[scorer]', bestScorers['"'+scorer+'"']);
    bestScorers.hasOwnProperty('"'+scorer+'"')? bestScorers['"'+scorer+'"'] +=1: bestScorers['"'+scorer+'"'] =1  ;
        // bestScorers[scorer] ? bestScorers.scorer +=1 : 1;
    // console.log('___-> bestScorers[scorer]', bestScorers['"'+scorer+'"']);

});

var topScorerTreshold = 3;
var scorers = Object.keys(bestScorers).map(function (key) {return {player: key.replace(/"/g, '').trim(),goals: bestScorers[key]}});
var sortedScorersToDisplay = _.filter(scorers, function(s){return s.goals>=topScorerTreshold});

sortedScorersToDisplay  = _.sortBy(sortedScorersToDisplay, "goals").reverse();

var topScorersByName = _.pluck(sortedScorersToDisplay, "player");


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
    d3.select('#histAxis')
        .style('display', 'initial')
        .transition().delay(1).duration(1500)
        .style('opacity', '1')
    ;
    if (!document.getElementById('histAxis')){
        var histAxis = goalsDiv.append('div')
            .attr('id', 'histAxis')
            .style('position', 'fixed')
            .style('top', window.innerHeight/2 + histBallRadius+'px')
            .style('left', window.innerWidth/2-12*histBallRadius)
            // .style('right', 'auto')
            .style('left', window.innerWidth/2-12*histBallRadius + 'px')
            .style('width',  25*histBallRadius+'px')
            .style('height', 3*histBallRadius+ 'px')
            .style('border-top', '2px solid lightgray')
            .style('background', 'yellow');

          histAxis.selectAll('div').data(d3.range(12)).enter().append('div').each(function(d, i){
            d3.select(this)
                // .style('background', 'green')
                .style('position', 'fixed').style('top', window.innerHeight/2+20 + 'px')
                .style('left', window.innerWidth/2-12*histBallRadius +(i+1/2)*2*histBallRadius +'px')
                .style('font-size',  '18px')
                .style('top',  window.innerHeight/2+20+'px')
                .style('color',  'green')
                .style('width',  '20px')
                .style('height', 3*histBallRadius+ 'px')
                .html("<h4>"+d*10+"'</h4>")
          })
        ;
    }
    updateGoalsContainer();
}
function griezmann(){
    var leftMarginfForGriezmann = window.innerWidth * 0.35;
    scorersBallRadius=30;
    goalsDiv.classed('hist', false);
    goalsDiv.classed('topScorers', true);
    console.log('___-> topscorers');
    var ballsInLine = Math.floor((window.innerWidth- 2*marginTop-leftMarginfForGriezmann)/(2*scorersBallRadius));
    //prepare boxes for players names
console.log('___-> ballsInLine', ballsInLine);
    d3.select('#scorersNames')
        .style('display', 'initial')
        .transition().delay(1).duration(1000)
        .style('opacity', '1')
        ;
    if (!document.getElementById('scorersNames')){
        var scorersNames = goalsDiv.append('div')
            .attr('id', 'scorersNames')
            .style('position', 'fixed')
            .style('top', 200+'px')
            .style('left', '30%')

        sortedScorersToDisplay.push({goals:_.filter(scorers, function(s){return s.goals==2}).length, player:"Two goal scorers:"})
        sortedScorersToDisplay.push({goals:_.filter(scorers, function(s){return s.goals==1}).length, player:"One goal scorers:"})
        scorersNames.selectAll('div').data(sortedScorersToDisplay).enter().append('div').each(function(d, i){
            if (i == sortedScorersToDisplay.length-1){var mod=0.5}else{var mod =0};
            console.log('___-> mod', mod);
            d3.select(this)
                .style('position', 'fixed')
                .style('top',  -300+ 'px')
                .style('left', 2*scorersBallRadius +'px')
                .style('top',  200+2*(i+mod)*scorersBallRadius+'px')
                .style('color',  'green')
                .style('width',  '30%')
                .style('text-align',  'right')
                .style('height', 3*scorersBallRadius+ 'px')
                .html("<h2>"+d.player.replace(/"/g, '')+"</h2>")
        })
        ;
    }
    var oneGoalsScorers = _.filter(scorers, function(s){return s.goals==1});
    var twoGoalsScorers = _.filter(scorers, function(s){return s.goals==2});
    var oneGoalScorersUsed = 0;
    var twoGoalScorersUsed = 0;
    scorersUsed = _.clone(bestScorers);
    console.log('___-> scorersUsed', scorersUsed);
    d3.selectAll('.ball')
        .each(function (d, i) {

            player = d.player.replace(/\(.*\)/i, '').trim();
            if (_.contains(topScorersByName, player)){console.log('_ccc__-> player', player);
                scorersUsed['"'+player+'"'] -=1;
                cy = 200+(2*topScorersByName.indexOf(player)+0.5)*scorersBallRadius;
                cx = leftMarginfForGriezmann + (bestScorers['"'+player+'"'] -scorersUsed['"'+player+'"']+1)*scorersBallRadius
            } else if (_.findWhere(scorers, {player: player}).goals ==2 ){
                cy = 200+(2*topScorersByName.length+0.5)*scorersBallRadius+Math.floor(twoGoalScorersUsed/ballsInLine)*scorersBallRadius;
                cx = leftMarginfForGriezmann + ((twoGoalScorersUsed)%ballsInLine+2)*scorersBallRadius;
                twoGoalScorersUsed +=1;
            } else if (_.findWhere(scorers, {player: player}).goals ==1){

                cy = 200+(2*topScorersByName.length+3.5)*scorersBallRadius+Math.floor(oneGoalScorersUsed/ballsInLine)*scorersBallRadius;//+
                cx = leftMarginfForGriezmann+((oneGoalScorersUsed)%ballsInLine+2)*scorersBallRadius;
                oneGoalScorersUsed +=1;

            }

            d3.select(this)
                .classed('hist', true)
                .classed('timeline-top', false)
                .transition().delay(1).duration(500)
                .style('top', cy + 'px')
                .style('left', cx + 'px')
                .style('width', histBallRadius+ 'px')
                .style('height', histBallRadius+ 'px')
            ;

        });
}
function ballsTransitionMiddleTop(scrollTop) {
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
    goalsDiv.selectAll(".ball.hist")
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
    }, 300); //100ms for example
}

