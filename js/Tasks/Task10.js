document.getElementById("build").addEventListener("click", buildGraphic);

function buildGraphic() {
    const lambda = parseFloat(document.getElementById('wavelength').value);
    const n = parseFloat(document.getElementById('coeff').value) * 1e-9;
    const d = parseFloat(document.getElementById('distBetween').value);
    const l = parseFloat(document.getElementById('distScreen').value);
    const L = n * l;

    const xs = [];
    const zs = [];
    const precision = 1000;
    for (let x = -10; x <= 10; x += 1 / precision) {
        xs.push(x);
        zs.push(4 * Math.pow(Math.cos((Math.PI * d * x) / (lambda * L)), 2));
    }

    let graphSettings = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    };

    Plotly.newPlot("answer1", [{
            x: xs, z: [zs], type: "heatmap", colorscale: [
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
            title: "Interference",
            xaxis: {
                autorange: true,
                title: 'x, m',
            },
            yaxis: {
                autorange: true,
                showgrid: false,
                zeroline: false,
                showticklabels: false,
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