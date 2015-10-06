var PasswordQualityEnum = require('../enums/PasswordQualityEnum');
var BigNumber = require('bignumber.js');

var defaultOptions = {
  // Current commercial bitcoin hashing hardware speed to approximate number of hashes per second a hacker can generate.
  // Assumes that hacker only has a single instance and not a rack.
  hashesPerSecond : (new BigNumber(5000000)).times(1000000),

  // Number of days to crack password.
  thresholds : {
    PasswordQualityEnum.UNSAFE : 0,
    PasswordQualityEnum.MODERATE : (new BigNumber(365)).times(10),
    PasswordQualityEnum.SAFE : (new BigNumber(365)).times(10000),
    PasswordQualityEnum.UNCRACKABLE : (new BigNumber(365)).times(1000000)
  }
}

var ComplexityChecker = {
  check : function(password, options) {
    var combinations,
        secondsToCrack,
        thresholds,
        threshold,
        bestSafety,
        complexity = 0;

    if (!options) {
      options = {};
    }

    // Has lower case
    if (password.match(/[a-z]/)) { complexity += 26; }
    // Has upper case
    if (password.match(/[A-Z]/)) { complexity += 26; }
    // Has numbers
    if (password.match(/[0-9]/)) { complexity += 10; }
    // Has symbols
    if (password.match(/\W/)) { complexity += 33; }

    complexity = new BigNumber(complexity);
    combinations = complexity.toPower(password.length());

    secondsToCrack = combinations.dividedToIntegerBy(hashesPerSecond);
    daysToCrack = secondsToCrack.dividedToIntegerBy(86400);

    thresholds = options.thresholds || defaultOptions.thresholds;

    for (var key in thresholds) {
      if(!thresholds.hasOwnProperty(key)) {
        continue;
      }
      threshold = thresholds[key];
      if (daysToCrack.greaterThan(threshold)) {
        bestSafety = key;
      }
    }
    return bestSafety;
  }
};