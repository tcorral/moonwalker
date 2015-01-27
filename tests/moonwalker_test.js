'use strict';

var grunt = require('grunt');
var path = require('path');
var cwd = process.cwd();
var parseString = require('xml2js').parseString;

function getXMLGeneratedAsJSON(testCase){
    var results = {};
    var actual = grunt.file.read(path.join(cwd, 'tests', 'generated', testCase, 'junit_report.xml'));
    parseString(actual, function (err, result){
        results.actual = result;
    });
    return results;
}


exports.moonwalker = {
    successLaunch: function (test){
        test.expect(1);
        var data = getXMLGeneratedAsJSON('success');
        test.equal(data.actual.testsuite.$.errors, '0');

        test.done();
    },
    errorLaunch: function (test){
        test.expect(1);
        var data = getXMLGeneratedAsJSON('error');
        test.equal(data.actual.testsuite.$.errors, '1');

        test.done();
    },
    allLaunch: function (test){
        test.expect(1);
        var data = getXMLGeneratedAsJSON('all');
        test.equal(data.actual.testsuite.$.errors, '1');

        test.done();
    }
};