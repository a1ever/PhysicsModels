document.getElementById("build").addEventListener("click", buildGraphic);

function buildGraphic() {
    const inductance = parseFloat(document.getElementById('inductance').value);
    const emf = parseFloat(document.getElementById('emf').value);
    const resistance = parseFloat(document.getElementById('ohm').value);

    const xs = [];
    const ys1 = [];
    const ys2 = [];
    const precision = 10000;
    const I0 = emf/resistance;
    for (let x = 0; x <= precision; x += 1 / precision) {
        xs.push(x);
        let param = Math.pow(Math.E, -resistance*x/inductance);
        ys1.push(I0*(1 - param));
        ys2.push(I0 * param);
        if (param < 10/precision) {
            break;
        }
    }

    let graphSettings = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    };

    Plotly.newPlot("answer1", [{x: xs, y: ys1, mode: "lines"}],
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
}