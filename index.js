var ComplexityChecker = require('./passwordCheckers/ComplexityChecker');
var PasswordQualityEnum = require('./enums/PasswordQualityEnum');

var checkers = [ComplexityChecker];

var checkPassword = function(password, options) {
  var minSafety = PasswordQualityEnum.UNCRACKABLE;
  for (checker in checkers) {
    var currentSafety = checker.check(password, options);
    if (minSafety > currentSafety) {
      minSafety = currentSafety;
    }
  }
  return minSafety;
};

var PasswordChecker = function(options) {
  this.options = options;
}

PasswordChecker.prototype.checkPassword = function(password) {
  return checkPassword(password, this.options);
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