const APP_ID = "a01ba479";
const APP_KEY = "fee5bfd18af444c73502763a71c3bdf2"

var data;

async function process() {
    let ingredients = document.getElementById("ingredients").value;
    let recipeJson = generateJson("Test", splitString(ingredients));
    let result = await sendData(recipeJson);
    let data = getValues(result.totalDaily);

    visualization(data);
}

async function sendData(data) {
    var prefix = 'https://cors-anywhere.herokuapp.com/';
    var url = `https://api.edamam.com/api/nutrition-details?app_id=${APP_ID}&app_key=${APP_KEY}`;

    const response = await fetch(prefix + url, {
        method: 'POST',
        body: data,
        headers: { 'Content-Type': 'application/json' }
    }).catch((error) => {
        alert(error);
    });
    return await response.json(); //extract JSON from the http response
}

function generateJson(title, ingredients) {
    let resultJson = {
        "title": title,
        "ingr": []
    }
    ingredients.forEach(ingredient => {
        resultJson.ingr.push(ingredient)
    });
    return JSON.stringify(resultJson);
}

function splitString(longString) {
    let smallStrings = longString.replace(/\r/g, "").split(/\n/);
    return smallStrings;
}

function getValues(nutrients) {
    let nutrientsJson = [];
    Object.keys(nutrients).forEach(
        e => nutrientsJson.push(
            {
                label: nutrients[e]['label'],
                quantity: +round(nutrients[e]['quantity'], 1)
            }
        )
    );
    return nutrientsJson;
}

function visualization(data) {
    d3.selectAll("g").remove();

    var barChartArea = d3.select("svg");

    let canvasWidth = barChartArea.node().clientWidth;
    let canvasHeight = barChartArea.node().clientHeight;

    const xScale = d3.scaleLinear().domain([0, 150]).range([0, canvasWidth]);
    const yScale = d3.scaleBand().domain(data.map(d => d.label)).rangeRound([canvasHeight, 0]).padding(0.1);

    const groups = barChartArea
        .selectAll('g')
        .data(data)
        .enter()
        .append('g');

    const bars = groups
        .append('rect')
        .attr('fill', ((d) => (d.quantity >= 100 ? 'green' : 'steelblue')))
        .attr('width', 0)
        .attr('height', yScale.bandwidth())
        .attr('x', 0)
        .attr('y', (d) => yScale(d.label))
        .transition()
        .duration(1000)
        .attr('width', ((d) => (d.quantity >= 100 ? xScale(125) : xScale(d.quantity))))
        .attr('height', yScale.bandwidth())
        .attr('x', 0)
        .attr('y', (d) => yScale(d.label));

   

    const labels = groups
    .data(data)
        .append('text')
        .classed('label', true)
        .attr('x', 0)
        .attr('y', (d) => yScale(d.label) + (yScale.bandwidth() * 0.75))
        .attr('font-size', '0.3em')
        .text(d => d.label);

    const values = groups
    .data(data)
        .append('text')
        .classed('value', true)
        .attr('x', (canvasWidth - 125) + 'px')
        .attr('y', (d) => yScale(d.label) + (yScale.bandwidth() * 0.75))
        .attr('font-size', '0.3em')
        .text(d => d.quantity + '%');
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}