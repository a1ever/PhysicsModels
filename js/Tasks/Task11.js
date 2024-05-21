document.getElementById("build").addEventListener("click", buildGraphic);

function normalizeValues(arr) {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return arr.map(value => (value - min) / (max - min));
}

function buildGraphic() {
    const lambda = parseFloat(document.getElementById('wavelength').value) * 1e-9;
    const N = parseFloat(document.getElementById('gaps').value);
    const b = parseFloat(document.getElementById('dist').value) * 1e-6;
    const d = parseFloat(document.getElementById('period').value) * 1e-6;

    const xs = [];
    const ys = [];
    const precision = 100;

    for (let x = -180; x <= 180; x += 1 / precision) {
        let phi = x * Math.PI / 360;
        xs.push(x);
        let u = ((Math.PI*b*Math.sin(phi))/lambda);
        let delta = ((Math.PI*d*Math.sin(phi))/lambda);
        ys.push(
            Math.pow(
            Math.sin(N*delta)
                /
            Math.sin(delta)
            , 2)
            *
            Math.pow(
            Math.sin(u)
                    /
            (u)
            , 2)
        );
    }

    let graphSettings = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    };

    Plotly.newPlot("answer1", [{x: xs, y: ys, mode: "lines"}],
        {
            title: "I(theta)",
            xaxis: {
                title: 'theta, °',
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
        x: xs, z: [normalizeValues(ys)], type: "heatmap", colorscale: [
                [0, "rgb(0, 0, 0)"],
                [0.2, "rgb(90, 90, 90)"],
                [0.5, "rgb(150, 150, 150)"],
                [0.8, "rgb(200, 200, 200)"],
                [1.0, "rgb(250, 250, 250)"]
            ],
            showscale: false,
        }],
        {
            title: "Visualization of the diffraction pattern",
            xaxis: {
                autorange: true,
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