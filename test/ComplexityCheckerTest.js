var ComplexityChecker = require('../passwordCheckers/ComplexityChecker');
var PasswordQualityEnum = require('../enums/PasswordQualityEnum');
var assert = require("assert");
var should = require('should');

describe('ComplexityChecker', function() {
  describe('check', function() {
    it('should return a value within PasswordQualityEnum', function() {
      var result = ComplexityChecker.check('testpassword');
      assert(result === PasswordQualityEnum.UNSAFE || result === PasswordQualityEnum.MODERATE ||
          result === PasswordQualityEnum.SAFE || result === PasswordQualityEnum.UNCRACKABLE);
    });
    it('should return UNCRACKABLE with the correct password length', function() {
      var thresholds = {};
      thresholds[PasswordQualityEnum.UNSAFE] = 0
      thresholds[PasswordQualityEnum.MODERATE] = 0
      thresholds[PasswordQualityEnum.SAFE] = 0
      thresholds[PasswordQualityEnum.UNCRACKABLE] = 1
      var result = ComplexityChecker.check('testpasswordthatislong', { thresholds : thresholds });
      result.should.equal(PasswordQualityEnum.UNCRACKABLE);
    });
    it('should return SAFE with the correct password length', function() {
      var thresholds = {};
      thresholds[PasswordQualityEnum.UNSAFE] = 0
      thresholds[PasswordQualityEnum.MODERATE] = 0
      thresholds[PasswordQualityEnum.SAFE] = 1
      thresholds[PasswordQualityEnum.UNCRACKABLE] = 1000000000
      var result = ComplexityChecker.check('testpasswordlong', { thresholds : thresholds });
      result.should.equal(PasswordQualityEnum.SAFE);
    });
    it('should return MODERATE with the correct password length', function() {
      var thresholds = {};
      thresholds[PasswordQualityEnum.UNSAFE] = 0
      thresholds[PasswordQualityEnum.MODERATE] = 1
      thresholds[PasswordQualityEnum.SAFE] = 1000000000
      thresholds[PasswordQualityEnum.UNCRACKABLE] = 1000000000
      var result = ComplexityChecker.check('testpasswordlong', { thresholds : thresholds });
      result.should.equal(PasswordQualityEnum.MODERATE);
    });
    it('should return UNSAFE with the correct password length', function() {
      var thresholds = {};
      thresholds[PasswordQualityEnum.UNSAFE] = 0
      thresholds[PasswordQualityEnum.MODERATE] = 1000000000
      thresholds[PasswordQualityEnum.SAFE] = 1000000000
      thresholds[PasswordQualityEnum.UNCRACKABLE] = 1000000000
      var result = ComplexityChecker.check('p', { thresholds : thresholds });
      result.should.equal(PasswordQualityEnum.UNSAFE);
    });
    it('should not error when using default parameters', function() {
      var result = ComplexityChecker.check('p');
      result.should.equal(PasswordQualityEnum.UNSAFE);
    })
  })
})