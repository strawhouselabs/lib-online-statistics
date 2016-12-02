/* eslint-disable id-length */ // disable id-length because we're dealing with mathy things that are all one letter.
const isNumbery = isFinite;
const constants = require('./constants');

/**
 * Returns the c4 correction factor aka the "unbiasing constant" for small sample standard deviations.
 *
 * @param {array}
 * @return {number}
 */
function getC4(n) {
  if (constants.c4[n]) return constants.c4[n];
  return constants.c4.others;
}


/**
 * Online mean, variance and standard deviation tracker.
 *
 * @param {number} values the list of values.
 * @param {boolean} [sample] whether this is population or sample variance.
 * @return {number}
 */
class Online {
  constructor() {
    this.instanceData = {
      mean: 0,
      deltaMean: 0,
      deltaMean2: 0,
      count: 0,
    };
  }

  observe(record) {
    function onlineAverage(meanSoFar, countSoFar, newRecord) {
      return ((meanSoFar * countSoFar) + newRecord) / (countSoFar + 1);
    }

    if (isNumbery(record)) {
      const number = Number(record);
      this.instanceData.mean = onlineAverage(this.instanceData.mean, this.instanceData.count, number);
      const delta = number - this.instanceData.mean;
      this.instanceData.deltaMean = onlineAverage(this.instanceData.deltaMean, this.instanceData.count, delta);
      this.instanceData.deltaMean2 = onlineAverage(this.instanceData.deltaMean2, this.instanceData.count, Math.pow(delta, 2));
      this.instanceData.count++;
    } else {
      throw Error('Non-numeric record.');
    }
  }

  mean() { return this.instanceData.mean; }
  variance(sample = false) {
    if (this.instanceData.count < 2) return NaN;
    const divisor = sample ? this.instanceData.count - 1 : this.instanceData.count;
    return this.instanceData.deltaMean2 / divisor;
  }

  standardDeviation(sample = false) {
    return Math.sqrt(this.variance(sample)) * getC4(this.instanceData.count);
  }

  toJSON() {
    return this.instanceData;
  }

  fromJSON(input) {
    const values = typeof input === 'string' ? JSON.parse(input) : input;
    const fields = Object.keys(values);
    if (!isNumbery(values.mean) || !isNumbery(values.deltaMean) || !isNumbery(values.deltaMean2) || !isNumbery(values.count)) {
      throw Error('Invalid fromJSON call. Call your mother.');
    }
    if (fields.length !== 4) {
      throw Error('Invalid fromJSON call. Remember to brush your teeth.');
    }

    this.instanceData = {};
    fields.forEach((key) => {
      this.instanceData[key] = values[key];
    });
  }
}

module.exports = Online;