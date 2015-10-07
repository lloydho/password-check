var ComplexityChecker = require('./passwordCheckers/ComplexityChecker');
var PasswordQualityEnum = require('./enums/PasswordQualityEnum');

var defaultCheckers = [ComplexityChecker];

var checkPassword = function(password, options) {
  var minSafety = PasswordQualityEnum.UNCRACKABLE;
  for (index in options.checkers) {
    var checker = options.checkers[index];
    if (checker.check === undefined) {
      throw new Error('Invalid checker without a check function found.');
    }
    var currentSafety = checker.check(password, options);
    if (minSafety > currentSafety) {
      minSafety = currentSafety;
    }
  }
  return minSafety;
};

var PasswordChecker = function(options) {
  this.options = options;
  if (this.options.checkers === undefined) {
    this.options.checkers = defaultCheckers;
  }
}

PasswordChecker.prototype.checkPassword = function(password) {
  return checkPassword(password, this.options);
}

PasswordChecker.prototype.addChecker = function(checker) {
  this.options.checkers.push(checker);
}

PasswordChecker.prototype.PasswordQualityEnum = PasswordQualityEnum;

// Export
// AMD.
if ( typeof define == 'function' && define.amd ) {
    define( function () { return PasswordChecker; } );

// Node and other environments that support module.exports.
} else if ( typeof module != 'undefined' && module.exports ) {
    module.exports = PasswordChecker;

// Browser.
} else {
    global.PasswordChecker = PasswordChecker;
}