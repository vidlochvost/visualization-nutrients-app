//variable containing reference to data
var data;

//D3.js canvases
var textArea;
var barChartArea;
var heatMap;

//D3.js svg elements
var selectedAreaText;

//variables for selection
var selectedRegion;

/*Loading data from CSV file and editing the properties to province codes. Unary operator plus is used to save the data as numbers (originally imported as string)*/
d3.csv("./public/data.csv")
  .row(function (d) {
    return {
      date: d.Date,
      Argentina: +d.Argentina,
      Buenos_Aires: +d["Buenos Aires"],
      La_Pampa: +d["La Pampa"],
      Mendoza: +d.Mendoza,
      Santa_Fe: +d["Santa Fe"],
      Córdoba: +d.Córdoba
    };
  }).get(function (error, rows) {
    //saving reference to data
    data = rows;

    //load map and initialise the views
    init();

    // data visualization
    visualization();
  });

/*----------------------
INITIALIZE VISUALIZATION
----------------------*/
function init() {

  let width = screen.width;
  let height = screen.height;

  //retrieve a SVG file via d3.request, 
  //the xhr.responseXML property is a document instance
  function responseCallback(xhr) {
    d3.select("#map_div").append(function () {
      return xhr.responseXML.querySelector('svg');
    }).attr("id", "map")
      .attr("width", width / 4)
      .attr("height", height - 100)
      .attr("x", 0)
      .attr("y", 0);
  };

  //You can select the root <svg> and append it directly
  d3.request("public/ar.svg")
    .mimeType("image/svg+xml")
    .response(responseCallback)
    .get(function (n) {
      let map = d3.select("body").select("#map");
      map.selectAll("path")
        .style("fill", "#000000")
        .style("stroke", "#3e4147")
        .on("click", function () {
          mapClick(this);
        });
    });

  //d3 canvases for svg elements
  textArea = d3.select("#text_div").append("svg")
    .attr("width", d3.select("#text_div").node().clientWidth)
    .attr("height", d3.select("#text_div").node().clientHeight);

  barChartArea = d3.select("#barchart_div").append("svg")
    .attr("width", d3.select("#barchart_div").node().clientWidth)
    .attr("height", d3.select("#barchart_div").node().clientHeight);

  heatMap = d3.select("#heatmap_div").append("svg")
    .attr("width", d3.select("#heatmap_div").node().clientWidth)
    .attr("height", d3.select("#heatmap_div").node().clientHeight);

  //init selections
  selectedRegion = null;
}


/*----------------------
BEGINNING OF VISUALIZATION
----------------------*/
function visualization() {

  drawTextInfo();

  drawBarChart();

  drawHeatMap();

}

/*----------------------
TASKS:
1) Create a bar chart of the number of ill people over the time in Argentina 
2) Create a heat map for all regions in the dataset
3) Connect SVG map with the bar chart
4) Animate bar chart transitions
----------------------*/

/*----------------------
TEXT INFORMATION
----------------------*/
function drawTextInfo() {
  //Draw headline
  textArea.append("text")
    .attrs({ dx: 20, dy: "1em", class: "headline" })
    .text("Graph of flu trends in Argentina");

  //Draw source
  textArea.append("text")
    .attrs({ dx: 20, dy: "3.5em", class: "subline" })
    .text("Data source: Google Flu Trends")
    .on("click", function () { window.open("http://www.google.org/flutrends"); });;

  //Draw selection information
  selectedAreaText = textArea.append("text")
    .attrs({ dx: 20, dy: "4.8em", class: "subline" })
    .text("Selected Region: " + selectedRegion);
}


/*----------------------
BAR CHART
----------------------*/
function drawBarChart() {

  let thisCanvasWidth = barChartArea.node().clientWidth;
  let thisCanvasHeight = barChartArea.node().clientHeight;

  let thisRectWidth = thisCanvasWidth / data.length;

  console.log(thisRectWidth);

  let topVal = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].Argentina > topVal) {
      topVal = data[i].Argentina;
    }
  }

  console.log(topVal);


  for (var i = 0; i < data.length; i++) {
    let thisRectHeight = thisCanvasHeight * (data[i].Argentina / topVal);
    barChartArea.append('rect')
      .attrs({
        x: i * thisRectWidth,
        y: 0,
        width: thisRectWidth,
        height: thisRectHeight,
        fill: 'red'
      })
      .transition()
      .duration(1000)
      .attrs({
        x: i * thisRectWidth,
        y: thisCanvasHeight,
        width: thisRectWidth,
        height: thisRectHeight,
        fill: 'red'
      })
      .transition()
      .duration(1000)
      .attrs({
        x: i * thisRectWidth,
        y: thisCanvasHeight - thisRectHeight,
        width: thisRectWidth,
        height: thisRectHeight,
        fill: 'red'
      })
      if(i / 150 == 0) {
        barChartArea.append('text')
        .attrs({x: i, y: i, dx: 10, dy: "1em", class: "subline" })
        .text(data[i].date)
      }
  }
  //Square example
  // barChartArea.append('rect')
  //         .attrs({ x: thisCanvasWidth/3, y: thisCanvasHeight/3, width: 80, height: 80, fill: 'red' })
  //         .transition()
  //         .duration(5000)
  //         .attrs({ x: 2*thisCanvasWidth/3, y: 2*thisCanvasHeight/3, width: 40, height: 40, fill: 'blue' });

}

/*----------------------
HEAT MAP
----------------------*/
function drawHeatMap() {

  //nothing here yet

}

/*----------------------
INTERACTION
----------------------*/
function mapClick(region) {
  console.log(region.id)
}






