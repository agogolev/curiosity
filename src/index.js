import _ from "lodash";
import d3KitTimeline from "d3kit-timeline";
import scaleTime from "d3-scale";
import axisBottom from "d3-axis";
import * as d3 from "d3";

var data = [
  {
    time: new Date(-7500, 0, 1),
    color: "#A580A5",
    name: "Çatalhöyük",
    country: "Turkey",
    short_description: "Early neolithic settlement",
    description:
      "Çatalhöyük is one of the earliest and largest known Neolithic settlements, providing unprecedented insights into the social organization, art, and ritual practices of early agricultural communities.",
    image: "catalhoyuk.jpg",
  },
  {
    time: new Date(-7500, 0, 1),
    color: "#FFA500",
    name: "Mardin Toy Car",
    country: "Turkey",
    short_description: "A toy car made of baked mud.",
    description: "",
    image: "mardin_toy_car.jpg",
  },
  {
    time: new Date(-8000, 0, 1),
    color: "#FFA500",
    name: "Cave of Swimmers",
    country: "Egypt",
    short_description: "Cave art depicting swimming human figures.",
    description:
      "The cave in Sahara desert with a depiction of human figures with their limbs bent in a way that suggests swimming. This questions what Sahara was like in prehistoric times. The cave also contains other drawings, including giraffes, hippopotamuses, other human figures  and negative handprints.",
    image: "cave_of_swimmers.jpg",
  },
  {
    time: new Date(-10000, 0, 1),
    color: "#A580A5",
    name: "Jericho",
    country: "Palestine",
    short_description: "One of the first Neolithic settlements.",
    description: "",
    image: "jericho.jpg",
  },
  {
    time: new Date(-11510, 0, 1),
    color: "#FFA500",
    name: "Red Deer Cave LL-1 Skull",
    country: "China",
    short_description: "Partial skull with unusual features.",
    description:
      "The LL-1 partial skull exhibits a mix of archaic and modern features and were tentatively thought to represent a late survival of an archaic human species.",
    image: "red_deer_cave_ll_1.jpg",
  },
  {
    time: new Date(-11600, 0, 1),
    color: "#A580A5",
    name: "Göbekli Tepe",
    country: "Turkey",
    short_description: "",
    description: "",
    image: "gobekli_tepe.jpg",
  },
  {
    time: new Date(-11700, 0, 1),
    color: "#A5A5FF",
    name: "Younger Dryas END",
    country: "",
    short_description: "",
    description: "",
    image: "",
  },
  {
    time: new Date(-12900, 0, 1),
    color: "#A5A5FF",
    name: "Younger Dryas START",
    country: "",
    short_description: "",
    description: "",
    image: "",
  },
  {
    time: new Date(-14000, 0, 1),
    color: "#FFA500",
    name: "Altramira Bison",
    country: "Spain",
    short_description: "A beautiful bison cave art.",
    description:
      'Altramira cave is another significant site with Upper Paleolithic cave paintings, often called the "Sistine Chapel of Prehistoric Art." Its polychrome paintings, particularly of bison, demonstrate advanced artistic techniques and a sophisticated understanding of animal forms.',
    image: "altamira_bison.jpg",
  },
  {
    time: new Date(-14500, 0, 1),
    color: "#FFA500",
    name: "Kapova Cave Camel",
    country: "Russia",
    short_description:
      "A two-humped camel drawing in the Kapova cave, located in Southern Urals.",
    description: "",
    image: "kapova_camel.jpg",
  },
  {
    time: new Date(-17000, 0, 1),
    color: "#FFA500",
    name: "Lascaux Cave",
    country: "France",
    short_description:
      "A cave painting in Lascaux, near Montignac, France, depicting a bull and a horse.",
    description: "",
    image: "lascaux_bull_horse.jpg",
  },
  {
    time: new Date(-25000, 0, 1),
    color: "#FFA500",
    name: "La Pasiega",
    country: "Spain",
    short_description: "La Pasiega inscription",
    description: "",
    image: "la_pasiega_inscription.jpg",
  },
  {
    time: new Date(-26000, 0, 1),
    color: "#FFA500",
    name: "Dolní Věstonice",
    country: "Czech Republic",
    short_description: "Burial of a three young individuals.",
    description:
      "The burial has a unique bodies arrangement – the central individual with possible pathological deformations, flanked by the other two, one with his hand placed on the central figure's pelvic area and the other lying face down. There is red ochre on all three skulls and grave goods, eg animal teeth necklaces.",
    image: "dolni_vestonice.jpg",
  },
  {
    time: new Date(-36000, 0, 1),
    color: "#FFA500",
    name: "Chauvet Cave",
    country: "France",
    short_description: "Drawings of lions hunting bison.",
    description: "",
    image: "chauvet_lions.jpg",
  },
  {
    time: new Date(-35000, 0, 1),
    color: "#FFA500",
    name: "Sungir",
    country: "Russia",
    short_description: "Exceptional Burial Site",
    description:
      "An Upper Paleolithic burial site with elaborate and rich burials, suggesting complex social structures and symbolic behavior.",
    image: "sungir_children.jpg",
  },
];

var chart = new d3KitTimeline("#timeline", {
  direction: "right",
  initialHeight: 1000,
  layerGap: 40,
  dotColor: (d) => d.color,
  labelBgColor: (d) => d.color,
  linkColor: (d) => d.color,
  labelTextColor: "#000000",
  domain: [new Date(-6000, 0, 1), new Date(-40000, 0, 1)],
  formatAxis: (axis) => axis.ticks(40).tickFormat((x) => `${x.getFullYear()}`),
  textFn: function (d) {
    return d.time.getFullYear().toString().slice(1) + " BC \n " + d.name;
  },
  timeFn: function (d) {
    return d.time;
  },
});

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
  imgElement.src = "img/" + event.data.image;
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

chart
  .data(data)
  .on("labelMouseover", mouseover)
  .on("labelMouseout", mouseout)
  .visualize();
