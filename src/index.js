import _ from 'lodash';
import d3KitTimeline from 'd3kit-timeline';
import scaleTime from 'd3-scale';
import axisBottom from 'd3-axis';

var data = [
  {time: new Date(-26000, 0, 1), color: '#FFA500', name: 'Dolní Věstonice', country: 'Czech Republic'},
  {time: new Date(-36000, 0, 1), color: '#FFA500', name: 'Chauvet Cave', country: 'France'},
  {time: new Date(-17000, 0, 1), color: '#FFA500', name: 'Lascaux Cave', country: 'France'},
  {time: new Date(-36000, 0, 1), color: '#FFA500', name: 'Cave of Altamira', country: 'Spain'},
  {time: new Date(-25000, 0, 1), color: '#FFA500', name: 'La Pasiega', country: 'Spain'},
  {time: new Date(-35000, 0, 1), color: '#FFA500', name: 'Sugir', country: 'Russia'},
  {time: new Date(-11600, 0, 1),  color: '#A580A5', name: 'Göbekli Tepe', country: 'Turkey'},
  {time: new Date(-10000, 0, 1),  color: '#A580A5', name: 'Jerico', country: 'West Bank'},
  {time: new Date(-7500, 0, 1),  color: '#A580A5', name: 'Çatalhöyük', country: 'Turkey'},
  {time: new Date(-12900, 0, 1), color: '#A5A5FF', name: 'Younger Dryas START', country: ''},
  {time: new Date(-11700, 0, 1), color: '#A5A5FF', name: 'Younger Dryas END', country: ''},
];

console.log(data);

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
  domain: [new Date(-37000, 0, 1), new Date(0, 0, 1)],
  // scale: scaleTime([new Date(-40000, 1, 1), new Date(0, 1, 1)]),
  // labella: {
  //   maxPos: 1100,
  //   algorithm: 'simple'
  // },
  formatAxis: axis => axis.ticks(20).tickFormat(x => `${x.getFullYear().toString().slice(1,3)},000`),
  textFn: function(d){
    return d.time.getFullYear().toString().slice(1) + ' BC \n ' + d.name;
  },
  timeFn: function(d){
    return d.time;
  },
  textStyle: {'width': '100px'}, 
});

chart.data(data).visualize();