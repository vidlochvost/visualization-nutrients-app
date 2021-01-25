const APP_ID = "a01ba479";
const APP_KEY = "fee5bfd18af444c73502763a71c3bdf2"

var data;

async function process() {
    let ingredients = document.getElementById("ingredients").value;
    let recipeJson = generateJson("Test", splitString(ingredients));
    console.log(recipeJson);
    let result = await sendData(recipeJson);
    //let result = getData();
    console.log(result);
    let data = getValues(result.totalDaily);
    //let data = getValues(result);

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

    var texts = groups
        .selectAll("text")
        .data(data)
        .enter();

    const labels = texts
        .append('text')
        .classed('label', true)
        .attr('x', 0)
        .attr('y', (d) => yScale(d.label) + (yScale.bandwidth() * 0.75))
        .attr('font-size', '0.3em')
        .text(d => d.label);

    const values = texts
        .append('text')
        .classed('value', true)
        .attr('x', (canvasWidth - 75) + 'px')
        .attr('y', (d) => yScale(d.label) + (yScale.bandwidth() * 0.75))
        .attr('font-size', '0.3em')
        .text(d => d.quantity + '%');
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function getData() {
    return {
        "CA": {
            "label": "Calcium",
            "quantity": 1.092,
            "unit": "%"
        },
        "CHOCDF": {
            "label": "Carbs",
            "quantity": 8.378066666666669,
            "unit": "%"
        },
        "CHOLE": {
            "label": "Cholesterol",
            "quantity": 200.01,
            "unit": "%"
        },
        "ENERC_KCAL": {
            "label": "Energy",
            "quantity": 4.732,
            "unit": "%"
        },
        "FASAT": {
            "label": "Saturated",
            "quantity": 0.2548,
            "unit": "%"
        },
        "FAT": {
            "label": "Fat",
            "quantity": 0.47600000000000003,
            "unit": "%"
        },
        "FE": {
            "label": "Iron",
            "quantity": 1.2133333333333334,
            "unit": "%"
        },
        "FIBTG": {
            "label": "Fiber",
            "quantity": 17.472,
            "unit": "%"
        },
        "FOLDFE": {
            "label": "Folate equivalent (total)",
            "quantity": 1.365,
            "unit": "%"
        },
        "K": {
            "label": "Potassium",
            "quantity": 4.143404255319149,
            "unit": "%"
        },
        "MG": {
            "label": "Magnesium",
            "quantity": 2.1666666666666665,
            "unit": "%"
        },
        "NA": {
            "label": "Sodium",
            "quantity": 0.07583333333333334,
            "unit": "%"
        },
        "NIA": {
            "label": "Niacin (B3)",
            "quantity": 1.0351249999999999,
            "unit": "%"
        },
        "P": {
            "label": "Phosphorus",
            "quantity": 2.86,
            "unit": "%"
        },
        "PROCNT": {
            "label": "Protein",
            "quantity": 0.9464,
            "unit": "%"
        },
        "RIBF": {
            "label": "Riboflavin (B2)",
            "quantity": 3.64,
            "unit": "%"
        },
        "THIA": {
            "label": "Thiamin (B1)",
            "quantity": 2.5783333333333336,
            "unit": "%"
        },
        "TOCPHA": {
            "label": "Vitamin E",
            "quantity": 2.1839999999999997,
            "unit": "%"
        },
        "VITA_RAE": {
            "label": "Vitamin A",
            "quantity": 100,
            "unit": "%"
        },
        "VITB6A": {
            "label": "Vitamin B6",
            "quantity": 5.74,
            "unit": "%"
        },
        "VITB12": {
            "label": "Vitamin B12",
            "quantity": 0,
            "unit": "%"
        },
        "VITC": {
            "label": "Vitamin C",
            "quantity": 9.302222222222223,
            "unit": "%"
        },
        "VITD": {
            "label": "Vitamin D",
            "quantity": 70,
            "unit": "%"
        },
        "VITK1": {
            "label": "Vitamin K",
            "quantity": 3.336666666666667,
            "unit": "%"
        },
        "ZN": {
            "label": "Zinc",
            "quantity": 0.6618181818181819,
            "unit": "%"
        }
    };
}