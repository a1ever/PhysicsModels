document.getElementById("build").addEventListener("click", buildGraphic);

const waves_quantity = 12;

const graphSettings = {
    scrollZoom: true,
    displayModeBar: true,
    displaylogo: false,
    responsive: true,
};

function normalizeValues(arr) {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return arr.map(value => (value - min) / (max - min));
}

function createCircleGrid(xs, zs) {
    const radius = Math.floor(xs.length);
    const gridSize = 2 * radius + 1;
    const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(1));
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


function getXValues() {
    const xValues = [];
    for (let x = 0; x < 1e-3; x += 1e-6) {
        xValues.push(x);
    }
    return xValues;
}

function getGolor(lambdaNM) {
    if (lambdaNM >= 380 && lambdaNM < 440) {
        return `rgb(${-(lambdaNM - 440) / (440 - 380) * 255},0,255)`;
    } else if (lambdaNM >= 440 && lambdaNM < 490) {
        return `rgb(0,${(lambdaNM - 440) / (490 - 440) * 255},255)`;
    } else if (lambdaNM >= 490 && lambdaNM < 510) {
        return `rgb(0,255,${-(lambdaNM - 510) / (510 - 490) * 255})`;
    } else if (lambdaNM >= 510 && lambdaNM < 580) {
        return `rgb(${(lambdaNM - 510) / (580 - 510) * 255},255,0)`;
    } else if (lambdaNM >= 580 && lambdaNM < 645) {
        return `rgb(255,${-(lambdaNM - 645) / (645 - 580) * 255},0)`;
    } else if (lambdaNM >= 645 && lambdaNM <= 780) {
        return `rgb(255,0,0)`;
    } else {
        return `rgb(0,0,0)`;
    }
}

function getIntensity(lambdaNM, r, nLens, nPlate, nBetween) {
    lambdaNM *= 1e-9;
    const ys = [];
    const R = Math.pow((nBetween-nPlate)/(nBetween+nPlate), 2);
    const T = (4 * nBetween * nLens)/ Math.pow(nBetween+nLens, 2);
    for (let x = 0; x < 1e-3; x += 1e-6) {
        let i1= Math.pow(T, 2) * R;
        let i2 = R;
        ys.push(i2 + i1 + 2 * Math.sqrt(i1 * i2) * Math.cos(2 * Math.PI / lambdaNM * (lambdaNM/2 * (nBetween>nPlate?0:1) + nBetween * Math.pow(x, 2) / (2 * r))));
    }
    return ys;
}

function getMono(wavelength, lens_radius, nLens, nPlate, nBetween) {
    if (wavelength < 0 || lens_radius < 0 || nLens < 1 || nPlate < 1  || nBetween < 1) {
        return;
    }

    const lineColor = getGolor(wavelength);
    const xyValues = getXValues();
    const ILineValues = getIntensity(wavelength, lens_radius, nLens, nPlate, nBetween);
    let IValues = createCircleGrid(xyValues, ILineValues);

    Plotly.newPlot("answer2", [{
        z: IValues,
        type: 'heatmap',
        colorscale: [
            [0, lineColor],
            [1, 'white']
        ],
        showscale: false,
    }], {
        title: "Кольца Ньютона",
        xaxis: {
            autorange: true,
            showgrid: false,
            scaleanchor: "y",
            zeroline: false,
            showticklabels: false,
        },
        yaxis: {
            autorange: true,
            showgrid: false,
            zeroline: false,
            showticklabels: false,
        },
        width: 700,
        height: 700,
    }, graphSettings);
    Plotly.newPlot("answer1", [{
        x: xyValues,
        y: ILineValues,
        mode: "lines",
        line: {
            color: lineColor
        }
    }], {
        title: "I(x)",
        xaxis: {
            autorange: true,
            title: 'x, м',
        },
        yaxis: {
            autorange: true,
            title: 'I, Вт/м^2',
        }
    }, graphSettings);
}


function getQuasi(wavelength_mid, wavelength_wide, lens_radius, nLens, nPlate, nBetween) {
    if (wavelength_mid < 0 || wavelength_mid < 0 || wavelength_wide < 0 || wavelength_mid + wavelength_wide / 2 > 780 || wavelength_mid - wavelength_wide / 2 < 380 || lens_radius < 0 || nLens < 1 || nLens < 1  || nBetween < 1) {
        return;
    }

    const quasi = []

    for (let i = 0; i < waves_quantity; i++) {
        quasi.push(wavelength_mid - wavelength_wide / 2 + wavelength_wide / (waves_quantity - 1) * i);
    }

    const intensity_for_wave = [];
    const xs = getXValues();

    for (let wavelength of quasi) {
        intensity_for_wave.push(getIntensity(wavelength, lens_radius, nLens, nPlate, nBetween))
    }

    const y_final = [];
    for (let k = 0; k < intensity_for_wave[0].length; k++) {
        let squaresSum = 0;
        let prodsSum = 0;

        for (let i = 0; i < waves_quantity; i++) {
            squaresSum += intensity_for_wave[i][k] * intensity_for_wave[i][k];
            for (let j = i + 1; j < intensity_for_wave.length; j++) {
                prodsSum += intensity_for_wave[i][k] * intensity_for_wave[j][k];
            }
        }

        y_final.push(Math.sqrt(squaresSum + 2 * prodsSum));
    }

    const quasi_data = [];

    for (let i = 0; i < waves_quantity; i++) {
        const is = {
            x: xs,
            y: intensity_for_wave[i],
            mode: 'lines',
            line: {
                color: getGolor(quasi[i])
            },
            showlegend: false,
        };

        quasi_data.push(is);
    }

    Plotly.newPlot("answer1", quasi_data, {
        title: "Интенсивность каждой из волн",
        xaxis: {
            showticklabels: false,
            autorange: true,
            title: 'r, м',
        },
        yaxis: {
            autorange: true,
            title: 'I, Вт/м^2',
        },
    }, graphSettings);

    Plotly.newPlot("answer2", [{
        x: xs,
        y: y_final,
        mode: "lines",
        line: {
            color: getGolor(wavelength_mid)
        }
    }], {
        title: "I(r)",
        xaxis: {
            autorange: true,
            title: 'r, м',
        },
        yaxis: {
            autorange: true,
            title: 'I, Вт/м^2',
        }
    }, graphSettings);

    Plotly.newPlot("answer3", [{
        z: createCircleGrid(xs, y_final),
        type: 'heatmap',
        colorscale: [
            [0, getGolor(wavelength_mid)],
            [1, 'white']
        ],
        showscale: false,
    }], {
        title: "Кольца Ньютона",
        xaxis: {
            autorange: true,
            showgrid: false,
            scaleanchor: "y",
            zeroline: false,
            showticklabels: false,
        },
        yaxis: {
            autorange: true,
            showgrid: false,
            zeroline: false,
            showticklabels: false,
        },
        width: 700,
        height: 700,
    }, graphSettings);
}

function buildGraphic() {
    const lens_radius = parseFloat(document.getElementById('lens_radius').value);
    const nLens = parseFloat(document.getElementById('nLens').value);
    const nPlate = parseFloat(document.getElementById('nPlate').value);
    const nBetween = parseFloat(document.getElementById('nBetween').value);
    const selectedType = document.querySelector('input[name="light_type"]:checked').value;
    if (selectedType === 'q') {
        const wavelength_mid = parseFloat(document.getElementById('wavelength_mid').value);
        const wavelength_wide = parseFloat(document.getElementById('wavelength_wide').value);
        getQuasi(wavelength_mid, wavelength_wide, lens_radius, nLens, nPlate, nBetween);
    } else {
        const wavelength = parseFloat(document.getElementById('wavelength').value);
        getMono(wavelength, lens_radius, nLens, nPlate, nBetween);
    }
}
