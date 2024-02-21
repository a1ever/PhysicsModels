document.getElementById("build").addEventListener("click", buildGraphic);

function buildGraphic() {
    const radius = parseFloat(document.getElementById('radius').value);
    const coilTurn = parseFloat(document.getElementById('n').value);
    const currentValue = parseInt(document.getElementById('amperes').value);

    const xs = [];
    const ys = [];
    const precision = 1000;

    for (let x = -radius * 10; x <= radius * 10; x += radius / precision) {
        xs.push(x);
        ys.push(4 * Math.PI * Math.pow(10, -7) * coilTurn * currentValue * Math.pow(radius, 2) / 2
            * (1 / Math.pow(Math.pow(Math.abs(x), 2)
                    + Math.pow(Math.abs(radius), 2), 1.5) +
                (1 / Math.pow(Math.pow(Math.abs(radius - x), 2)
                    + Math.pow(Math.abs(radius), 2), 1.5))));
    }

    const points = [{x: xs, y: ys, mode: "lines"}];

    Plotly.newPlot("answer", points,
        {
            title: "B(x)",
            xaxis: {
                title: 'x, м',
            },
            yaxis: {
                title: 'В, Т',
            },
            plot_bgcolor: '#363636',
            paper_bgcolor: '#050505',
            font: {
                color: '#FFFFFF',
                family: 'American TextC',
            },
            colorway: ['#ee840c'],
            autosize: true,
        },{
            scrollZoom: true,
            displayModeBar: true,
            displaylogo: false,
            responsive: true,
        });
}