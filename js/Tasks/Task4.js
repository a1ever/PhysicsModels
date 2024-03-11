document.getElementById("build").addEventListener("click", buildGraphic);

function buildGraphic() {
    const magneticInduction = parseFloat(document.getElementById('tesla').value);
    const frequency = parseFloat(document.getElementById('hertz').value);
    const resistance = parseFloat(document.getElementById('ohm').value);
    const area = parseInt(document.getElementById('square').value);

    const xs = [];
    const ys1 = [];
    const ys2 = [];
    const precision = 10000;

    for (let x = 0; x <= 100; x += 1 / precision) {
        xs.push(x);
        let w = (2 * Math.PI * frequency)
        let E = magneticInduction * w  *area * Math.sin(w * x)
        ys1.push(E);
        ys2.push(E / resistance);
    }

    let graphSettings = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    };
    Plotly.newPlot("answer1", [{x: xs, y: ys1, mode: "lines"}],
        {
            title: "E(t)",
            xaxis: {
                range: [0, Math.min(50/frequency, 10)],
                title: 't, sec',
            },
            yaxis: {
                autorange: true,
                title: 'E, V',
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

    Plotly.newPlot("answer2", [{x: xs, y: ys2, mode: "lines"}],
        {
            title: "I(t)",
            xaxis: {
                range: [0, Math.min(50/frequency, 10)],
                title: 't, sec',
            },
            yaxis: {
                autorange: true,
                title: 'I, A',
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