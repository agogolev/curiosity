import _ from "lodash";
import d3KitTimeline from "d3kit-timeline";
// import d3Timeline from "d3-timeline";
import scaleTime from "d3-scale";
import axisBottom from "d3-axis";
import * as d3 from "d3";
import * as Data from "./data.js";

var chart = new d3KitTimeline("#timeline", {
  direction: "right",
  initialHeight: 3000,
  layerGap: 40,
  dotColor: (d) => d.color,
  labelBgColor: (d) => d.color,
  linkColor: (d) => d.color,
  labelTextColor: "#000000",
  domain: [new Date(0, 0, 1), new Date(-100000, 0, 1)],
  formatAxis: (axis) => axis.ticks(40).tickFormat((x) => `${x.getFullYear()}`),
  textFn: function (d) {
    return d.time.getFullYear().toString().slice(1) + " BC \n " + d.name;
  },
  timeFn: function (d) {
    return d.time;
  },
});

// Prepare to handle tooltip.
const Tooltip = document.getElementById("tooltip");
const ChartDiv = document.getElementsByClassName("d3kit-chart-root")[0];
const absoluteTop = ChartDiv.getBoundingClientRect().top + window.scrollY;
const absoluteLeft = ChartDiv.getBoundingClientRect().left + window.scrollX;

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function (event) {
  console.log(event);
  const x = event.x + event.w + absoluteLeft;
  const y = event.y - event.h + absoluteTop;

  Tooltip.style.left = `${x + 10}px`; // Adjust position as needed
  Tooltip.style.top = `${y + 10}px`; // Adjust position as needed
  Tooltip.style.display = "block";

  const shortDescription = document.createElement("div");
  shortDescription.textContent = event.data.short_description;

  const description = document.createElement("div");
  description.textContent = event.data.description;

  const imgElement = document.createElement("img");
  imgElement.src = "static/img/" + event.data.image;
  imgElement.style.width = "300px";

  Tooltip.appendChild(shortDescription);
  Tooltip.appendChild(description);
  Tooltip.appendChild(imgElement);

  Tooltip.style.visibility = "visible";
};

var mouseout = function () {
  Tooltip.style.visibility = "hidden";
  // Remove residual content
  Tooltip.innerHTML = "";
};

// Render the main timeline.

chart
  .data(Data.milestones)
  .on("labelMouseover", mouseover)
  .on("labelMouseout", mouseout)
  .visualize();

// Render Vostok temperatures.

function renderVostokTemps(data) {
    // set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 };
var width = 460 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#timeline2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// const data = [{"date":2000, "temp": -8}, {"date": 80000, "temp":8}];

console.log(1111);
console.log(data);

// Add X axis 
var xScale = d3
  .scaleLinear()
  .domain([2000, 100000])
  .range([0, width]);

svg
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale));

// Add Y axis
var yScale = d3
  .scaleLinear()
  .domain([-10.1, 10.1])
  .range([height, 0]);

svg.append("g").call(d3.axisLeft(yScale));

const lineAccessor = d3.line().x(d => xScale(d.date)).y(d => yScale(d.temp));

console.log(2222);
console.log(lineAccessor(data[0]));

// Add the line
svg
  .append("path")
  .data([data])
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .attr("d", lineAccessor);

  };

const data = d3.csv(
  "static/vostok_10000.csv",
  // When reading the csv, format variables:
  function (d) {
    return { date: parseInt(d.year), temp: parseFloat(d.temp) };
  },
).then(
  renderVostokTemps);





