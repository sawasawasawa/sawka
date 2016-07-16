var goalData = [];

data = _.sortBy(data, "date");

data = _.each(data, function(d, i){
    data[i].matchNumber = i;
});
for (i=0; i<data.length; i++) {
    var goals = data[i].goals;


    for (k=0; k<goals.length;k++){
        var goalInfo = goals[k];
        goalInfo.matchId = data[i].matchId;
        goalInfo.matchNumber = data[i].matchNumber;
        goalData.push(goalInfo)
    }
}
var svg = d3.select("svg");

var numberOfMatches = data.length;
var totalLength_SIMPLIFIED = numberOfMatches * 100;
var delayTime = 1;
var durationTime = 300;
var minHeight = 500;
var maxHeight = window.innerHeight;
var minWidth = 680;
// var svgHeight = Math.min(maxHeight,Math.max(window.innerHeight, minHeight));
var svgHeight = numberOfMatches* 100;
var svgWidth = Math.max(window.innerWidth, minWidth);
var ballRadius = 10;
var matchLengthOnTimeline = 100;
var rectWidth = 300;
var margin = maxHeight/2-150;
var marginTop = 25;

svg.style("width", svgWidth)
.style("height", svgHeight);





var yScale = d3.scale.linear()
    .domain([0, totalLength_SIMPLIFIED])
    .range([marginTop, svgHeight - marginTop]);

var xScale = d3.scale.linear()
    .domain([0, totalLength_SIMPLIFIED])
    .range([marginTop, svgWidth - marginTop]);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(10);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("top")
    .ticks(10);

svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0," + marginTop + ")")
    .call(yAxis);

svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0," + marginTop + ")")
    .call(xAxis);

// var tip = d3.tip()
//     .attr('class', 'd3-tip')
//     .offset([10, 50])
//     .html(function(d) {
//         return d.timing +" minuta </br>" +
//             "<strong>Strzelec:</strong> <span style='color:red'>" + d.player + "</span></br>"+
//                 "<strong>Asysta:</strong> <span style='color:red'>" + d.assist + "</span></br>";
//     })
//
// svg.call(tip);
svg.selectAll("rect")
.data(data)
.enter()
.append("rect")
.each(function (d, i) {
    var _teams =[d.home, d.away];
    var scaledY = Math.round(yScale((d.matchNumber)*100));/// aka timeFromStart


    for (j=0; j<2;j++) {
        var fill ='url(#'+_teams[j]+')';
        var offset = j ? 20 : -20;
        var cx =Math.round(margin+j*(rectWidth/2)) +offset;
        if (_teams[j]=='Irlandia Północna'){
           fill = 'url(#NorthernIreland)'
        }

        svg
            .append("rect")
            .on("click", function () {
                              console.log(d);
            })
            .attr("id", 'id' + (_teams[j] + d.date).replace(/\./g, '').replace(/ /g, '').replace(/:/g, ''))
            .classed(_teams[j], true)
            .attr("y", svgHeight)
            .attr("x", -100+j*(svgWidth+100))
            .attr("width", 145)
            .attr("height", 90)
            .transition().delay(100*i/5).duration(250*i/2+500)
            .attr("y", scaledY)
            .attr("x", cx)
            .attr('fill', fill)

        ;
    }
    d3.select(this).remove()
});

svg.selectAll("circle")
    .data(goalData)
    .enter()
    .append("circle")
    .attr("r", ballRadius)
    .each(function (d, i) {
        var scaledY = Math.round(yScale((d.matchNumber)*100+parseInt(d.timing))); /// aka timeFromStart
        var _fill = "url(#ball)";
        var _describedMatch = _.find(data, function(dd) {return d.matchId == dd.matchId});

        var _awayTeamScored = _describedMatch.home == d.team;
        var offset = _awayTeamScored ? -10 : 10;
        // _awayTeamScored ? offset = 50 : offset = -50;

        var cx_zero =  Math.round(svgWidth/2+100*offset*(Math.random()));
        d3.select(this)
            .style('opacity', 0)
            .attr("cx", cx_zero )
            .attr("cy", scaledY + Math.round((-0.5+Math.random())*100))
            .attr("id", i)
            .transition().delay(200 + 100*d.matchNumber/5).duration(250*d.matchNumber/2)
            .attr("cx", Math.round(margin+rectWidth/2+offset))
            .attr("cy", Math.round(scaledY))
            .style('opacity', '1')

            .style("fill",_fill)
        ;



        d3.select(this).on('click', function() {
            console.log(this.getBoundingClientRect())
        })
        ;

        // d3.select(this).on('mouseover', tip.show)
        // ;

    });

window.onscroll = function() {myFunction()};

function myFunction() {
    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    console.log('____________________scrollTop');
    console.log(scrollTop);
    // console.log(svg.selectAll("circle"));

    svg.selectAll("circle")
        .each(function(d, i){
            console.log((d.matchNumber-1)*90 );
            // console.log(this.cy.baseVal.value<scrollTop)

            if (this.cy.baseVal.value<scrollTop+150  ) {
                var scaledX = Math.round(xScale((d.matchNumber)*100+parseInt(d.timing))); /// aka timeFromStart
                this.cy.baseVal.value = scrollTop+40;
                this.cx.baseVal.value = scaledX ;
            }

            if (this.cy.baseVal.value<scrollTop+150  ) {
                var scaledX = Math.round(xScale((d.matchNumber)*100+parseInt(d.timing))); /// aka timeFromStart
                this.cy.baseVal.value = scrollTop+40;
                this.cx.baseVal.value = scaledX ;
            }
        })

    // if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    //     document.getElementById("myP").className = "test";
    // } else {
    //     document.getElementById("myP").className = "";
    // }
}


