const chart = require("./chart");

// Functions
function toFarsiNumber(n) {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  return n.toString().replace(/\d/g, (x) => farsiDigits[x]);
}

// Instantiating a Radar Chart
function radar(dataset) {
  const radarChart = new chart.RadarChart(dataset);

  const { canvas, innerPoints, mainPoints, dataPoints, textPoints, n } =
    radarChart;
  innerPoints.push(mainPoints);

  let pointsAttr = innerPoints.map((item) => chart.SVG.pathDGenerator(item));
  let dataAttr = chart.SVG.pathDGenerator(dataPoints);

  const colors = chart.Color.getRandomColorArr(n);

  return {
    canvas,
    dataset,
    colors,
    pointsAttr,
    dataAttr,
    dataPoints,
    textPoints,
    fs: { farsiNum: toFarsiNumber },
  };
}

module.exports = {
  radar,
}
