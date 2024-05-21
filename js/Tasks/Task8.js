document.getElementById("build").addEventListener("click", buildGraphic);

class ComplexNumber {
    constructor({ re = 0, im = 0 } = {}) {
        this.re = re;
        this.im = im;
    }

    add(x) {
        return new ComplexNumber({
            re: this.re + x.re,
            im: this.im + x.im,
        });
    }

    multiply(x) {
        return new ComplexNumber({
            re: this.re * x.re - this.im * x.im,
            im: this.re * x.im + this.im * x.re,
        });
    }

    divide(x) {
        const divident = this.multiply(this.conjugate(x));
        const divider = (x.re ** 2) + (x.im ** 2);

        return new ComplexNumber({
            re: divident.re / divider,
            im: divident.im / divider,
        });
    }

    conjugate(number) {
        return new ComplexNumber({
            re: number.re,
            im: -1 * number.im,
        });
    }
    abs() {
        return Math.sqrt(this.re * this.re + this.im * this.im)
    }
}
function discreteFourierTransform(input) {
    const ans = [];

    for (let frequency = 0; frequency < input.length; frequency += 1) {
        let frequencySignal = new ComplexNumber();

        for (let t = 0; t < input.length; t += 1) {
            const currentAmplitude = input[t];
            const rotationAngle = -1 * (2 * Math.PI) * frequency * (t / input.length);

            // e^ix = cos(x) + i * sin(x);
            const dataPointContribution = new ComplexNumber({
                re: Math.cos(rotationAngle),
                im: Math.sin(rotationAngle),
            }).multiply(new ComplexNumber({ re: currentAmplitude }));
            frequencySignal = frequencySignal.add(dataPointContribution);
        }

        frequencySignal = frequencySignal.divide(new ComplexNumber({ re: input.length }));
        ans[frequency] = frequencySignal.abs();
    }

    return ans;
}

function buildGraphic() {
    const freq1 = parseFloat(document.getElementById('freq1').value);
    const freq2 = parseFloat(document.getElementById('freq2').value);
    const coeff = parseFloat(document.getElementById('coeff').value);

    const xs = [];
    const ys1 = [];
    const ys2 = [];
    const ys3 = [];
    let ys41 = [];
    let ys42 = [];
    let ys43 = [];
    const precision = 1000;

    for (let x = 0; x <= 1; x += 1 / precision) {
        xs.push(x);
        ys1.push(Math.sin(2*Math.PI*freq1*x));
        ys2.push(Math.sin(2*Math.PI*freq2*x));
        ys3.push(Math.sin(2*Math.PI*freq1*x) * (1 + coeff * Math.sin(2*Math.PI*freq2*x)));
    }

    ys41 = discreteFourierTransform(ys1);
    ys42 = discreteFourierTransform(ys2);
    ys43 = discreteFourierTransform(ys3);

    let graphSettings = {
        scrollZoom: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true,
    };

    Plotly.newPlot("answer1", [{x: xs, y: ys1, mode: "lines"}],
        {
            title: "Base signal",
            xaxis: {
                title: 't, sec',
            },
            yaxis: {
                autorange: true,
                title: 'Amplitude',
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
            title: "Information signal",
            xaxis: {
                title: 't, sec',
            },
            yaxis: {
                autorange: true,
                title: 'Amplitude',
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
            title: "Modulation signal",
            xaxis: {
                title: 't, sec',
            },
            yaxis: {
                autorange: true,
                title: 'Amplitude',
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

    Plotly.newPlot("answer41", [{x: xs, y: ys41, mode: "lines"}],
        {
            title: "Spectre of base signal",
            xaxis: {
                title: 'frequency, Hz',
            },
            yaxis: {
                autorange: true,
                title: 'Amplitude',
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
    Plotly.newPlot("answer42", [{x: xs, y: ys42, mode: "lines"}],
        {
            title: "Spectre of information signal",
            xaxis: {
                title: 'frequency, Hz',
            },
            yaxis: {
                autorange: true,
                title: 'Amplitude',
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
    Plotly.newPlot("answer43", [{x: xs, y: ys43, mode: "lines"}],
        {
            title: "Spectre of modulation signal",
            xaxis: {
                title: 'frequency, Hz',
            },
            yaxis: {
                autorange: true,
                title: 'Amplitude',
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