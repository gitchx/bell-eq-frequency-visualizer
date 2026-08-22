export type BiquadCoefficients = {
  b0: number;
  b1: number;
  b2: number;
  a1: number;
  a2: number;
};

export type FilterParameters = {
  frequency: number;
  gain: number;
  q: number;
  sampleRate: number;
};

export type FilterDefinition = {
  id: string;
  label: string;
  coefficients: (parameters: FilterParameters) => BiquadCoefficients;
};

export const peakingFilter: FilterDefinition = {
  id: 'peaking',
  label: 'Peaking EQ',
  coefficients({ frequency, gain, q, sampleRate }) {
    const A = Math.pow(10, gain / 40);
    const omega0 = (2 * Math.PI * frequency) / sampleRate;
    const alpha = Math.sin(omega0) / (2 * q);
    const cosine = Math.cos(omega0);
    const a0 = 1 + alpha / A;

    return {
      b0: (1 + alpha * A) / a0,
      b1: (-2 * cosine) / a0,
      b2: (1 - alpha * A) / a0,
      a1: (-2 * cosine) / a0,
      a2: (1 - alpha / A) / a0,
    };
  },
};

export function magnitudeDb(
  coefficients: BiquadCoefficients,
  frequency: number,
  sampleRate: number,
) {
  const omega = (2 * Math.PI * frequency) / sampleRate;
  const cos1 = Math.cos(omega);
  const sin1 = Math.sin(omega);
  const cos2 = Math.cos(2 * omega);
  const sin2 = Math.sin(2 * omega);
  const numeratorReal = coefficients.b0 + coefficients.b1 * cos1 + coefficients.b2 * cos2;
  const numeratorImaginary = -coefficients.b1 * sin1 - coefficients.b2 * sin2;
  const denominatorReal = 1 + coefficients.a1 * cos1 + coefficients.a2 * cos2;
  const denominatorImaginary = -coefficients.a1 * sin1 - coefficients.a2 * sin2;

  return 20 * Math.log10(
    Math.hypot(numeratorReal, numeratorImaginary) /
      Math.hypot(denominatorReal, denominatorImaginary),
  );
}
