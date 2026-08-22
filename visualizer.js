/**
 * UI and SVG rendering for the Bell EQ visualizer.
 * Audio/filter mathematics live in biquad.js.
 */
(function startVisualizer() {
  'use strict';

  const SAMPLE_RATE = 48000;
  const MIN_FREQUENCY = 20;
  const MAX_FREQUENCY = 20000;
  const MIN_DB = -24;
  const MAX_DB = 24;
  const GRAPH_WIDTH = 1000;
  const GRAPH_HEIGHT = 430;
  const RESPONSE_POINTS = 500;

  const frequencyTicks = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
  const decibelTicks = [24, 18, 12, 6, 0, -6, -12, -18, -24];
  const coefficientLabels = ['a0 / ff0', 'a1 / ff1', 'a2 / ff2', 'b1 / fb1', 'b2 / fb2'];

  function element(id) {
    return document.getElementById(id);
  }

  function sliderToFrequency(value) {
    return MIN_FREQUENCY * Math.pow(MAX_FREQUENCY / MIN_FREQUENCY, value / 1000);
  }

  function frequencyToX(frequency) {
    return (
      Math.log(frequency / MIN_FREQUENCY) /
      Math.log(MAX_FREQUENCY / MIN_FREQUENCY)
    ) * GRAPH_WIDTH;
  }

  function decibelsToY(decibels) {
    return ((MAX_DB - decibels) / (MAX_DB - MIN_DB)) * GRAPH_HEIGHT;
  }

  function formatFrequency(frequency) {
    if (frequency < 1000) return `${Math.round(frequency)} Hz`;

    const decimals = frequency >= 10000 ? 1 : 2;
    const kilohertz = (frequency / 1000)
      .toFixed(decimals)
      .replace(/0+$/, '')
      .replace(/\.$/, '');
    return `${kilohertz} kHz`;
  }

  function drawGrid() {
    let markup = '';

    decibelTicks.forEach((decibels) => {
      const y = decibelsToY(decibels);
      const label = `${decibels > 0 ? '+' : ''}${decibels}`;
      markup += `<line x1="0" y1="${y}" x2="${GRAPH_WIDTH}" y2="${y}" class="grid ${decibels === 0 ? 'zero' : ''}"/>`;
      markup += `<text x="-12" y="${y + 4}" text-anchor="end" class="axis">${label}</text>`;
    });

    frequencyTicks.forEach((frequency) => {
      const x = frequencyToX(frequency);
      const anchor = frequency === MIN_FREQUENCY
        ? 'start'
        : frequency === MAX_FREQUENCY
          ? 'end'
          : 'middle';
      const label = frequency >= 1000 ? `${frequency / 1000}k` : frequency;
      markup += `<line x1="${x}" y1="0" x2="${x}" y2="${GRAPH_HEIGHT}" class="grid"/>`;
      markup += `<text x="${x}" y="458" text-anchor="${anchor}" class="axis">${label}</text>`;
    });

    element('grid').innerHTML = markup;
  }

  function updateSliderProgress() {
    document.querySelectorAll('input[type="range"]').forEach((slider) => {
      const progress = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
      slider.style.setProperty('--p', `${progress}%`);
    });
  }

  function renderResponse() {
    const frequency = sliderToFrequency(Number(element('freq').value));
    const gainDb = Number(element('gain').value);
    const q = Number(element('q').value);

    const coefficients = Biquad.peakingCoefficients({
      frequency,
      gainDb,
      q,
      sampleRate: SAMPLE_RATE,
    });

    const points = [];
    for (let index = 0; index < RESPONSE_POINTS; index += 1) {
      const normalizedX = index / (RESPONSE_POINTS - 1);
      const x = normalizedX * GRAPH_WIDTH;
      const responseFrequency = sliderToFrequency(normalizedX * 1000);
      const responseDb = Biquad.magnitudeDb(
        coefficients,
        responseFrequency,
        SAMPLE_RATE,
      );
      points.push(`${x.toFixed(2)},${decibelsToY(responseDb).toFixed(2)}`);
    }

    const centerX = frequencyToX(frequency);
    const centerDb = Biquad.magnitudeDb(coefficients, frequency, SAMPLE_RATE);
    const centerY = decibelsToY(centerDb);
    const pointString = points.join(' ');

    element('curve').setAttribute('points', pointString);
    element('area').setAttribute('points', `0,215 ${pointString} 1000,215`);
    element('cursor').setAttribute('x1', centerX);
    element('cursor').setAttribute('x2', centerX);

    ['ring', 'dot'].forEach((id) => {
      element(id).setAttribute('cx', centerX);
      element(id).setAttribute('cy', centerY);
    });

    element('freqOut').value = formatFrequency(frequency);
    element('gainOut').value = `${gainDb > 0 ? '+' : ''}${gainDb.toFixed(1)} dB`;
    element('qOut').value = q.toFixed(2);
    element('magnitude').textContent = `${centerDb >= 0 ? '+' : ''}${centerDb.toFixed(2)} dB`;
    element('at').textContent = `@ ${formatFrequency(frequency)}`;

    element('coeffs').innerHTML = Object.values(coefficients)
      .map((value, index) => (
        `<div><span>${coefficientLabels[index]}</span>${value.toFixed(6)}</div>`
      ))
      .join('');

    updateSliderProgress();
  }

  drawGrid();
  document.querySelectorAll('input[type="range"]').forEach((slider) => {
    slider.addEventListener('input', renderResponse);
  });
  renderResponse();
})();
