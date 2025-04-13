import _ from "lodash";
import d3KitTimeline from "d3kit-timeline";
// import d3Timeline from "d3-timeline";
import scaleTime from "d3-scale";
import axisBottom from "d3-axis";
import * as d3 from "d3";
import * as Data from "./data.js";

const TIMELINE_HEIGHT = 3000;
const TICKS_NUM = 100;  // number of ticks on the y axis. The domain values are from 100,000 BC to 0 BC. Each 1 thousand years there is 1 tick.
const TIME_RANGE = [new Date(-100000, 0, 1), new Date(1, 0, 1)];

// Configure the main timeline.

var chart = new d3KitTimeline("#main_timeline", {
  margin: {"left": 60, "right": 20, "top": 0, "bottom": 0},
  direction: "right",
  initialHeight: TIMELINE_HEIGHT,
  layerGap: 40,
  dotColor: (d) => d.color,
  labelBgColor: (d) => d.color,
  linkColor: (d) => d.color,
  labelTextColor: "#000000",
  domain: [TIME_RANGE[1], TIME_RANGE[0]],
  formatAxis: (axis) => axis.ticks(TICKS_NUM).tickFormat((x) => `${x.getFullYear()}`),
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

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function (event) {
  if (event.data.short_description) {
    const absoluteTop = ChartDiv.getBoundingClientRect().top;
    const absoluteLeft = ChartDiv.getBoundingClientRect().left;
    const offset = 100;
    const x = absoluteLeft + offset + event.w + window.scrollX;
    const y = absoluteTop + event.y - event.h + window.scrollY;

    Tooltip.style.left = `${x + 10}px`; // Adjust position as needed
    Tooltip.style.top = `${y + 10}px`; // Adjust position as needed
    Tooltip.style.display = "block";

    if (event.data.country) {
      const countryDiv = document.createElement("div");
      countryDiv.textContent = event.data.country;
      Tooltip.appendChild(countryDiv);
    }
    
    const shortDescription = document.createElement("div");
    shortDescription.textContent = event.data.short_description;
    Tooltip.appendChild(shortDescription);

    if (event.data.description) {
      const description = document.createElement("div");
      description.textContent = event.data.description;
      Tooltip.appendChild(description);
    }

    if (event.data.image) {
      const imgElement = document.createElement("img");
      imgElement.src = "static/img/" + event.data.image;
      imgElement.style.width = "300px";
      Tooltip.appendChild(imgElement);

      const imgLink = document.createElement("a");
      imgLink.href = event.data.link;
      imgLink.textContent = event.data.link_text;
      console.log(imgLink);
      Tooltip.appendChild(imgLink);
    }

    Tooltip.style.visibility = "visible";
  }
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
  var margin = { top: 0, right: 30, bottom: 0, left: 60 };
  var width = 250 - margin.left - margin.right;
  var height = TIMELINE_HEIGHT;

  // append the svg object to the body of the page
  var svg = d3
    .select("#temperature_timeline")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // const data = [{"date":new Date(-100000, 0, 1), "temp": -8}, {"date": new Date(0, 0, 1), "temp":4}];

  // Add X axis 
  var xScale = d3
    .scaleLinear()
    .domain([-10, 4])
    .range([0, width]);
  svg.append("g").attr("visibility", "hidden").call(d3.axisBottom(xScale));

  // Add Y axis
  var yScale = d3
    .scaleTime()
    .domain(TIME_RANGE)
    .range([height, 0]);
  svg
    .append("g")
    .call(d3.axisLeft(yScale).ticks(TICKS_NUM).tickFormat((x) => x.getFullYear()));

  const lineAccessor = d3.line().x(d => xScale(d.temp)).y(d => yScale(d.date));

  // Create the circle that travels along the curve of chart
  var focus = svg
    .append('g')
    .append('circle')
      .style("fill", "none")
      .attr("stroke", "black")
      .attr('r', 8.5)
      .style("opacity", 0)

  // Create the text that travels along the curve of chart
  var focusText = svg
    .append('g')
    .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")

  // Add the line
  svg
    .append("path")
    .data([data])
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", lineAccessor);

  // What happens when the mouse move -> show the annotations at the right positions.
  function line_chart_mouseover() {
    focus.style("opacity", 1);
    focusText.style("opacity",1);
  }

  function line_chart_mousemove(event) {
    // recover coordinate we need
    var yAtPointer = yScale.invert(d3.pointer(event)[1]);
    var bisectDate = d3.bisector((d, x) => x - d.date.getFullYear()).left;
    var dateAtPointerIndex = bisectDate(data, yAtPointer.getFullYear());
    var selectedData = data[dateAtPointerIndex];
    focus
      .attr("cx", xScale(selectedData.temp))
      .attr("cy", yScale(selectedData.date));
    focusText
      .html(selectedData.temp.toString().substring(0, 4) + " c°")
      .attr("x", xScale(selectedData.temp)+15)
      .attr("y", yScale(selectedData.date));
    }

  function line_chart_mouseout() {
    focus.style("opacity", 0);
    focusText.style("opacity", 0);
  }

  // Create a rect on top of the svg area: this rectangle recovers mouse position
  svg
    .append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('width', width)
    .attr('height', height)
    .on('mouseover', line_chart_mouseover)
    .on('mousemove', line_chart_mousemove)
    .on('mouseout', line_chart_mouseout);
};

const data = d3.csv(
  "static/vostok_10000.csv",
  // When reading the csv, format variables:
  function (d) {
    // d.year is a year BP -- before present. Subtract from "current" time 2000 AC to get the date.
    return { date: new Date(2000-d.year, 0, 1), temp: parseFloat(d.temp) };
  },
).then(
  renderVostokTemps);
