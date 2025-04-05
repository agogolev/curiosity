import _ from 'lodash';
import d3KitTimeline from 'd3kit-timeline';
import scaleTime from 'd3-scale';
import axisBottom from 'd3-axis';
import * as d3 from 'd3';

var data = [
  {time: new Date(-26000, 0, 1), color: '#FFA500', name: 'Dolní Věstonice', country: 'Czech Republic'},
  {time: new Date(-36000, 0, 1), color: '#FFA500', name: 'Chauvet Cave', country: 'France'},
  {time: new Date(-17000, 0, 1), color: '#FFA500', name: 'Lascaux Cave', country: 'France'},
  {time: new Date(-36000, 0, 1), color: '#FFA500', name: 'Cave of Altamira', country: 'Spain'},
  {time: new Date(-25000, 0, 1), color: '#FFA500', name: 'La Pasiega', country: 'Spain'},
  {time: new Date(-35000, 0, 1), color: '#FFA500', name: 'Sungir', country: 'Russia'},
  {time: new Date(-11600, 0, 1),  color: '#A580A5', name: 'Göbekli Tepe', country: 'Turkey'},
  {time: new Date(-10000, 0, 1),  color: '#A580A5', name: 'Jerico', country: 'Palestine'},
  {time: new Date(-7500, 0, 1),  color: '#A580A5', name: 'Çatalhöyük', country: 'Turkey'},
  {time: new Date(-12900, 0, 1), color: '#A5A5FF', name: 'Younger Dryas START', country: ''},
  {time: new Date(-11700, 0, 1), color: '#A5A5FF', name: 'Younger Dryas END', country: ''},
  {time: new Date(-7500, 0, 1), color: '#A580A5', name: 'Mardin Toy Car', country: 'Turkey'},
];

var chart = new d3KitTimeline('#timeline', {
  direction: 'right',
  // margin:  {'left': 40, 'right': 20, 'top': 20, 'bottom': 20},
  // initialWidth: 480,
  initialHeight: 1200,
  layerGap: 40,
  dotColor: d => d.color,
  labelBgColor: d => d.color,
  linkColor: d => d.color,
  labelTextColor: '#000000',
  domain: [new Date(-3000, 0, 1), new Date(-37000, 0, 1)],
  // scale: scaleTime([new Date(-40000, 1, 1), new Date(0, 1, 1)]),
  // labella: {
  //   maxPos: 1100,
  //   algorithm: 'simple'
  // },
  formatAxis: axis => axis.ticks(40).tickFormat(x => `${x.getFullYear()}`),
  textFn: function(d){
    return d.time.getFullYear().toString().slice(1) + ' BC \n ' + d.name;
  },
  timeFn: function(d){
    return d.time;
  },
  // textStyle: {'width': '100px'}, 
});


const Tooltip = document.getElementById('tooltip');
const ChartDiv = document.getElementsByClassName("d3kit-chart-root")[0];
const absoluteTop = ChartDiv.getBoundingClientRect().top + window.scrollY;
const absoluteLeft = ChartDiv.getBoundingClientRect().left + window.scrollX;

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(event) {
    console.log(event);
    const x = event.x + event.w + absoluteLeft;
    const y = event.y - event.h + absoluteTop;
    Tooltip.textContent = event.data.name;
    Tooltip.style.left = `${x + 10}px`; // Adjust position as needed
    Tooltip.style.top = `${y + 10}px`;  // Adjust position as needed
    Tooltip.style.display = 'block';
    Tooltip.style.visibility = 'visible';
  // d3.select(d)
  //   .style("stroke", "black")
  //   .style("opacity", 1)
}

var mouseout = function() {
    // Tooltip.style.display = 'hidden';
}

chart.data(data).on('labelMouseover', mouseover).on('labelMouseout', mouseout).visualize();