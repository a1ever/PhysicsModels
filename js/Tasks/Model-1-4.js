document.getElementById("build").addEventListener("click", buildGraphic);

function buildGraphic() {
    const L = parseFloat(document.getElementById('suspension_length').value);
    const L1 = parseFloat(document.getElementById('spring_distance').value);
    const m = parseFloat(document.getElementById('mass').value);
    const beta = parseFloat(document.getElementById('attenuation_coefficient').value);
    const k = parseFloat(document.getElementById('stiffness_coefficient').value);
    let phi_01 = parseFloat(document.getElementById('initial_deviation_1').value);
    let phi_02 = parseFloat(document.getElementById('initial_deviation_2').value);

    if (L < 0 || L1 < 0 || L1 > L || m < 0 || beta < 0 || k < 0 || phi_01 < -90 || phi_02 < -90 || phi_01  > 90 || phi_02  > 90) {
        alert("Некоректный ввод!")
        return;
    }

    phi_01 = phi_01*2*Math.PI/360;
    phi_02 = phi_02*2*Math.PI/360;

    const xs = [];
    const phi1 = [];
    const phi2 = [];
    const v1 = [];
    const v2 = [];

    const g = 9.8;
    const omega_01 = Math.sqrt(g / L);
    const omega_02 = Math.sqrt(g / L + (2 * k * L1 ** 2) / (m * L ** 2));
    const omega_1 = Math.sqrt(omega_01 ** 2 - beta ** 2);
    const omega_2 = Math.sqrt(omega_02 ** 2 - beta ** 2);
    const cf1 = (phi_01 + phi_02) / 2;
    const cf2 = (phi_01 - phi_02) / 2;

    for (let x = 0; x <= 500; x += 5/1e4) {
        xs.push(x);
        let phi_a = cf1 * Math.exp(-beta * x) * Math.cos(omega_1 * x);
        let phi_b = cf2 * Math.exp(-beta * x) * Math.cos(omega_2 * x);
        let l_a = -L * (cf1 * Math.exp(-beta * x) * (beta * Math.cos(omega_1 * x) + omega_1 * Math.sin(omega_1 * x)));
        let l_b = L * (cf2 * Math.exp(-beta * x) * (beta * Math.cos(omega_2 * x) + omega_2 * Math.sin(omega_2 * x)));
        phi1.push(phi_a + phi_b);
        phi2.push(phi_a - phi_b);
        v1.push(l_a - l_b);
        v2.push(l_a + l_b);
    }

    document.getElementById('frequency_1').textContent = omega_01.toFixed(2) + " рад/с";
    document.getElementById('frequency_2').textContent = omega_02.toFixed(2) + " рад/с";

    let graphSettings = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    };

    Plotly.newPlot("answer1", [{x: xs, y: phi1, mode: "lines"}],
        {
        title: "phi1(t)",
        xaxis: {
            title: 't, с',
        },
        yaxis: {
            autorange: true,
            title: 'phi, градусы',
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

    Plotly.newPlot("answer2", [{x: xs, y: phi2, mode: "lines"}],
        {
        title: "phi2(t)",
        xaxis: {
            title: 't, с',
        },
        yaxis: {
            autorange: true,
            title: 'phi, градусы',
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

    Plotly.newPlot("answer3", [{x: xs, y: v1, mode: "lines"}],
        {
            title: "v1(t)",
            xaxis: {
                autorange: true,
                title: 't, с',
            },
            yaxis: {
                autorange: true,
                title: 'v, м/с',
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

    Plotly.newPlot("answer4", [{x: xs, y: v2, mode: "lines"}],
        {
            title: "v2(t)",
            xaxis: {
                autorange: true,
                title: 't, с',
            },
            yaxis: {
                autorange: true,
                title: 'v, м/с',
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