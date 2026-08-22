/**
 * Biquad filter calculations used by the visualizer.
 *
 * The coefficient formulas follow the RBJ Audio EQ Cookbook.
 * Coefficients returned by this file are normalized so that a0 = 1.
 */
(function attachBiquad(global) {
  'use strict';

  /**
   * Calculate normalized coefficients for a peaking (bell) EQ.
   *
   * @param {object} parameters
   * @param {number} parameters.frequency  Center frequency in Hz.
   * @param {number} parameters.gainDb     Boost/cut amount in dB.
   * @param {number} parameters.q          Quality factor.
   * @param {number} parameters.sampleRate Sample rate in Hz.
   * Naming intentionally matches RNBO's biquad.next() signal-flow roles.
   *
   * @returns {{feedforward0:number, feedforward1:number, feedforward2:number, feedback1:number, feedback2:number}}
   */
  function peakingCoefficients({ frequency, gainDb, q, sampleRate }) {
    const amplitude = Math.pow(10, gainDb / 40);
    const omega0 = (2 * Math.PI * frequency) / sampleRate;
    const alpha = Math.sin(omega0) / (2 * q);
    const cosine = Math.cos(omega0);

    // Normalize all coefficients by a0 so the denominator begins with 1.
    const a0 = 1 + alpha / amplitude;

    return {
      // RNBO: biquad.next(input, a0, a1, a2, b1, b2)
      feedforward0: (1 + alpha * amplitude) / a0,
      feedforward1: (-2 * cosine) / a0,
      feedforward2: (1 - alpha * amplitude) / a0,
      feedback1: (-2 * cosine) / a0,
      feedback2: (1 - alpha / amplitude) / a0,
    };
  }

  /**
   * Evaluate 20 * log10(|H(e^jw)|) at one frequency.
   *
   * H(z) = (ff0 + ff1*z^-1 + ff2*z^-2)
   *      / (1   + fb1*z^-1 + fb2*z^-2)
   *
   * @param {{feedforward0:number, feedforward1:number, feedforward2:number, feedback1:number, feedback2:number}} coefficients
   * @param {number} frequency  Evaluation frequency in Hz.
   * @param {number} sampleRate Sample rate in Hz.
   * @returns {number} Magnitude in dB.
   */
  function magnitudeDb(coefficients, frequency, sampleRate) {
    const omega = (2 * Math.PI * frequency) / sampleRate;
    const cos1 = Math.cos(omega);
    const sin1 = Math.sin(omega);
    const cos2 = Math.cos(2 * omega);
    const sin2 = Math.sin(2 * omega);

    const numeratorReal =
      coefficients.feedforward0 +
      coefficients.feedforward1 * cos1 +
      coefficients.feedforward2 * cos2;
    const numeratorImaginary =
      -coefficients.feedforward1 * sin1 - coefficients.feedforward2 * sin2;
    const denominatorReal =
      1 + coefficients.feedback1 * cos1 + coefficients.feedback2 * cos2;
    const denominatorImaginary =
      -coefficients.feedback1 * sin1 - coefficients.feedback2 * sin2;

    const numeratorMagnitude = Math.hypot(numeratorReal, numeratorImaginary);
    const denominatorMagnitude = Math.hypot(denominatorReal, denominatorImaginary);

    return 20 * Math.log10(numeratorMagnitude / denominatorMagnitude);
  }

  global.Biquad = Object.freeze({
    peakingCoefficients,
    magnitudeDb,
  });
})(window);
