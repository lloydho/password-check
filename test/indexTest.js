var PasswordChecker = require('../index.js');
var PasswordQualityEnum = require('../enums/PasswordQualityEnum');
var should = require('should');
var sinon = require('sinon');

describe('PasswordChecker', function() {
  describe('#addChecker', function() {
    it('should add object to options.checkers', function() {
      var passwordChecker = new PasswordChecker({checkers : []});
      passwordChecker.addChecker({});
      passwordChecker.options.checkers.length.should.equal(1);
    });
  });
  describe('#checkPassword', function() {
    it('should not fail when there are no checkers', function() {
      var passwordChecker = new PasswordChecker({checkers : []});
      passwordChecker.checkPassword('password');
    });
    it('should run check function of every checker', function() {
      var passwordChecker = new PasswordChecker({checkers : []});
      var checkFunction = sinon.stub().returns(PasswordQualityEnum.SAFE);
      passwordChecker.addChecker({check : checkFunction});
      passwordChecker.checkPassword('password');
      checkFunction.callCount.should.equal(1);
    });
    it('should not fail on invalid checkers', function() {
      var passwordChecker = new PasswordChecker({checkers : []});
      passwordChecker.addChecker({});
      passwordChecker.checkPassword.bind(passwordChecker, 'password').should.throw();
    });
    it('should return minimum safety', function() {
      var passwordChecker = new PasswordChecker({checkers : []});
      var safeReturn = sinon.stub().returns(PasswordQualityEnum.SAFE);
      var moderateReturn = sinon.stub().returns(PasswordQualityEnum.MODERATE);
      passwordChecker.addChecker({check : safeReturn});
      passwordChecker.addChecker({check : moderateReturn});
      passwordChecker.checkPassword('password').should.equal(PasswordQualityEnum.MODERATE);
    })
  })
});