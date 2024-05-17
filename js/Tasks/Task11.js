document.getElementById("build").addEventListener("click", buildGraphic);

function normalizeValues(arr) {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return arr.map(value => (value - min) / (max - min));
}

function createCircleGrid(xs, zs) {
    const radius = Math.floor(xs.length);
    const gridSize = 2 * radius + 1;
    const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    const centerX = radius;
    const centerY = radius;

    const normalizedZs = normalizeValues(zs);
    normalizedZs.forEach((value, index) => {
        for (let j = 0; j < 360; j+=0.01) {
            let angle = j*Math.PI/180;
            const x = centerX+  Math.round(index * Math.cos(angle));
            const y = centerY+Math.round(index * Math.sin(angle));
            grid[y][x] = value;
        }
    });

    return grid;
}

function buildGraphic() {
    const lambda = parseFloat(document.getElementById('wavelength').value) * 1e-9;
    const nBetween = parseFloat(document.getElementById('coeffBetween').value);
    const nPlate = parseFloat(document.getElementById('coeffPlate').value);
    const nLens = parseFloat(document.getElementById('coeffLens').value);
    const r = parseFloat(document.getElementById('radius').value);

    const xs = [];
    const xs2 = [];
    const ys = [];
    const precision = 100000;
    const R = Math.pow((nBetween-nPlate)/(nBetween+nPlate), 2);
    const T = (4 * nBetween * nLens)/ Math.pow(nBetween+nLens, 2);
    for (let x = -0.00333; x < 0; x += 1 / precision) {
        xs2.push(x);
    }
    for (let x = 0; x <= 0.00333; x += 1 / precision) {
        let i1 = Math.pow(T, 2) * R;
        let i2 = R;
        xs.push(x);
        xs2.push(x);
        ys.push(i2 + i1 + 2 * Math.sqrt(i1 * i2) * Math.cos(2 * Math.PI / lambda * (lambda/2 + nBetween * Math.pow(x, 2) / (2 * r))));
    }

    let graphSettings = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    };

    Plotly.newPlot("answer1", [{x: xs, y: ys, mode: "lines"}],
        {
            title: "I(r)",
            xaxis: {
                title: 'r, m',
            },
            yaxis: {
                autorange: true,
                title: 'Intensity, W/m^2',
            },
            plot_bgcolor: '#363636',
            paper_bgcolor: '#050505',
            font: {
                color: '#FFFFFF',
                family: 'American TextC',
            },
            colorway: ['#ee840c'],
            autosize: true,
        }, graphSettings);


    Plotly.newPlot("answer2", [{
             y: xs2, x: xs2, z: createCircleGrid(xs, ys), type: "heatmap", colorscale: [
                [0, "rgb(0, 0, 0)"],
                [0.1, "rgb(20, 20, 20)"],
                [0.2, "rgb(40, 40, 40)"],
                [0.3, "rgb(60, 60, 60)"],
                [0.4, "rgb(80, 80, 80)"],
                [0.5, "rgb(100, 100, 100)"],
                [0.6, "rgb(120, 120, 120)"],
                [0.7, "rgb(140, 140, 140)"],
                [0.8, "rgb(160, 160, 160)"],
                [0.9, "rgb(180, 180, 180)"],
                [1.0, "rgb(200, 200, 200)"]
            ],
            showscale: false,
        }],
        {
            title: "Newton's Rings",
            xaxis: {
                autorange: true,
                showgrid: false,
                zeroline: false,
                showticklabels: false,
            },
            yaxis: {
                autorange: true,
                showgrid: false,
                zeroline: false,
                showticklabels: false,
                scaleanchor:"x",
                scaleratio: 1,
            },
            plot_bgcolor: '#363636',
            paper_bgcolor: '#050505',
            font: {
                color: '#FFFFFF',
                family: 'American TextC',
            },
            autosize: true,
        }, graphSettings);
}