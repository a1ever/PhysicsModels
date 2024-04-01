document.getElementById("build").addEventListener("click", buildGraphic);

function buildGraphic() {
    const freq1 = parseFloat(document.getElementById('freq1').value);
    const freq2 = parseFloat(document.getElementById('freq2').value);
    const amp = parseFloat(document.getElementById('amp').value);

    const xs = [];
    const ys1 = [];
    const precision = 10000;

    let dw = freq2-freq1;
    let w = freq1;
    for (let x = 0; x <= 10; x += 1 / precision) {
        xs.push(x);
        ys1.push(2*amp*Math.cos((2 * w + dw) * x / 2) * Math.cos(dw*x / 2));
    }

    let graphSettings = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    };

    Plotly.newPlot("answer1", [{x: xs, y: ys1, mode: "lines"}],
        {
            title: "Beat X(t)",
            xaxis: {
                title: 't, sec',
            },
            yaxis: {
                autorange: true,
                title: 'x',
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

}