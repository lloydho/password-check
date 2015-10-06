var PasswordQualityEnum = require('../enums/PasswordQualityEnum');
var BigNumber = require('bignumber.js');

var thresholds = {};
thresholds[PasswordQualityEnum.UNSAFE] = 0
thresholds[PasswordQualityEnum.MODERATE] = (new BigNumber(365)).times(10);
thresholds[PasswordQualityEnum.SAFE] = (new BigNumber(365)).times(10000);
thresholds[PasswordQualityEnum.UNCRACKABLE] = (new BigNumber(365)).times(1000000);

var defaultOptions = {
  // Current commercial bitcoin hashing hardware speed to approximate number of hashes per second a hacker can generate.
  // Assumes that hacker only has a single instance and not a rack.
  hashesPerSecond : (new BigNumber(5000000)).times(1000000),

  // Number of days to crack password.
  thresholds : thresholds
}

var ComplexityChecker = {
  check : function(password, options) {
    var combinations,
        secondsToCrack,
        thresholds,
        hashesPerSecond,
        threshold,
        bestSafety,
        complexity = 0;

    if (!options) {
      options = {};
    }
    thresholds = options.thresholds || defaultOptions.thresholds;
    hashesPerSecond = options.hashesPerSecond || defaultOptions.hashesPerSecond;

    // Has lower case
    if (password.match(/[a-z]/)) { complexity += 26; }
    // Has upper case
    if (password.match(/[A-Z]/)) { complexity += 26; }
    // Has numbers
    if (password.match(/[0-9]/)) { complexity += 10; }
    // Has symbols
    if (password.match(/\W/)) { complexity += 33; }

    complexity = new BigNumber(complexity);
    combinations = complexity.toPower(password.length);

    secondsToCrack = combinations.dividedToIntegerBy(hashesPerSecond);
    daysToCrack = secondsToCrack.dividedToIntegerBy(86400);

    for (var key in thresholds) {
      if(!thresholds.hasOwnProperty(key)) {
        continue;
      }
      threshold = thresholds[key];
      if (daysToCrack.greaterThanOrEqualTo(threshold)) {
        bestSafety = key;
      }
    }
    return parseInt(bestSafety);
  }
};

module.exports = ComplexityChecker;