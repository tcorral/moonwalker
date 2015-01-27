'use strict';

var grunt = require('grunt');
var path = require('path');
var cwd = process.cwd();
var parseString = require('xml2js').parseString;
var moonwalker = require('../src');
var launcher = moonwalker.launcher;
var reporters = moonwalker.reporters;
var reporter = require('../lib/reporters/junit');

function getXMLGeneratedAsJSON(testCase){
    var results = {};
    var actual = grunt.file.read(path.join(cwd, 'test', 'generated', testCase, 'junit_report.xml'));
    parseString(actual, function (err, result){
        results.actual = result;
    });
    return results;
}


exports.moonwalker = {
    successLaunch: function (test){
        test.expect(1);
        launcher(
            ['test/fixtures/SeleneseSearchSuccess'], {
                selenium: {
                    host: 'localhost',
                    port: 4444
                },
                desiredCapabilities: [
                    {
                        browserName: 'firefox'
                    }
                ]
            },
            reporters.junit('test/generated/success/junit_report.xml'),
            function (){
                var data = getXMLGeneratedAsJSON('success');
                test.equal(data.actual.testsuite.$.errors, '0');
                test.done();
            }
        );
    },
    errorLaunch: function (test){
        test.expect(1);
        launcher(
            ['test/fixtures/SeleneseSearch'], {
                selenium: {
                    host: 'localhost',
                    port: 4444
                },
                desiredCapabilities: [
                    {
                        browserName: 'firefox'
                    }
                ]
            },
            reporters.junit('test/generated/error/junit_report.xml'),
            function (){
                var data = getXMLGeneratedAsJSON('error');
                test.equal(data.actual.testsuite.$.errors, '1');

                test.done();
            }
        );
    },
    allLaunch: function(test){
        test.expect(1);
        launcher(
            [
                'test/fixtures/SeleneseSearch',
                'test/fixtures/SeleneseSearchSuccess'
            ],
            {
                selenium: {
                    host: 'localhost',
                    port: 4444
                },
                desiredCapabilities: [
                    {
                        browserName: 'firefox'
                    }
                ]
            },
            reporters.junit('test/generated/all/junit_report.xml'),
            function (){
                var data = getXMLGeneratedAsJSON('all');
                test.equal(data.actual.testsuite.$.errors, '1');

                test.done();
            }
        );
    }
};