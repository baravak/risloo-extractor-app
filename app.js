const express = require("express");
const path = require("path");
const chart = require("./src/chart");

// Dataset object
const dataset = [
  {
    label: "نزدیک بودن",
    subLabel: "(دلبستگی ایمن)",
    data: 4,
  },
  {
    label: "اضطراب",
    subLabel: "(دلبستگی اضطرابی - دوسوگرا)",
    data: 9,
  },
  {
    label: "وابستگی",
    subLabel: "(دلبستگی اجتنابی)",
    data: 15,
  },
  {
    label: "عنوان",
    subLabel: "(زیرعنوان)",
    data: 19,
  },
  {
    label: "عنوان",
    subLabel: "(زیرعنوان)",
    data: 11,
  },
];

// Functions
function toFarsiNumber(n) {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  return n.toString().replace(/\d/g, (x) => farsiDigits[x]);
}

// Instantiating the Chart
const radarChart = new chart.RadarChart(dataset);

const { canvas, innerPoints, mainPoints, dataPoints, textPoints, n } = radarChart;
innerPoints.push(mainPoints);

let pointsAttr = innerPoints.map((item) => chart.SVG.pathDGenerator(item));
let dataAttr = chart.SVG.pathDGenerator(dataPoints);

const colors = chart.Color.getRandomColorArr(n);

// Init App
const app = express();

// Load View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Home Route
app.get("/", function (req, res) {
  res.render("radar", {
    canvas,
    dataset,
    colors,
    pointsAttr,
    dataAttr,
    dataPoints,
    textPoints,
    fs: { farsiNum: toFarsiNumber },
  });
});

// Start Server
app.listen(3000);
