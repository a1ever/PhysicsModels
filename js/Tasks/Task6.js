document.getElementById("build").addEventListener("click", buildGraphic);

function buildGraphic() {
    const inductance = parseFloat(document.getElementById('inductance').value);
    const capacitance = parseFloat(document.getElementById('millifarads').value) / 1000;
    const resistance = parseFloat(document.getElementById('ohm').value);

    const xs = [];
    const ys1 = [];
    const ys2 = [];
    const ys3 = [];
    const precision = 10000;
    const q0 = 1;
    const beta = resistance/ (2 * inductance);
    const w_0 = 1 / Math.sqrt(inductance * capacitance);
    const w = Math.sqrt(w_0 ** 2 - beta ** 2);

    for (let x = 0; x <= 10; x += 1 / precision) {
        xs.push(x);
        let charge = q0 * Math.exp(-beta*x) * Math.cos(w*x);
        ys1.push(charge);
        ys2.push(w_0 * charge);
        ys3.push(charge/capacitance);
    }

    let graphSettings = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    };

    Plotly.newPlot("answer1", [{x: xs, y: ys1, mode: "lines"}],
        {
            title: "q(t)",
            xaxis: {
                title: 't, sec',
            },
            yaxis: {
                autorange: true,
                title: 'q, C',
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

    Plotly.newPlot("answer3", [{x: xs, y: ys3, mode: "lines"}],
        {
            title: "V(t)",
            xaxis: {
                title: 't, sec',
            },
            yaxis: {
                autorange: true,
                title: 'V, volt',
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