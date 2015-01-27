var fs = require('fs');
var grunt = require('grunt');
var escapeXML = require('../../xml/escape/index');
// ## JUnit-compatible reporting callback


// ### The reporting function generator
// The function itself create a new reporting function, which will write the testreport in a given `filename`.
module.exports = function(filename) {

    // During the execution it keeps track of the current `suite`-name and `testcase`, and then record the testresult in the `results`-object. `errorDetected` keeps track that we only report one error per testcase, even if there are several failures.
    var suite, testcase;
    var results = {};
    var errorDetected = false;
// ### Static variables
    var errorCount = 0;

    // #### Generate xml report
    // Transform to junit-like xml for Jenkins
    function results2xml(errorsNumber) {
        errorCount = 0;
        var result = ['<testsuite name="root" errors="' + errorsNumber + '">'];
        Object.keys(results).forEach(function(suite) {
            result.push('\r\n\t<testsuite name="' + escapeXML(suite) + '">');
            Object.keys(results[suite]).forEach(function(testcase) {
                result.push('\r\n\t\t<testcase name="' +
                escapeXML(testcase) + '">');
                results[suite][testcase].forEach(function(err) {
                    result.push('\r\n\t\t\t<failure>\r\n\t\t\t\t' +
                    escapeXML(JSON.stringify(err)) +
                    '\r\n\t\t\t</failure>');
                });
                result.push('\r\n\t\t</testcase>');
            });
            result.push('\r\n\t</testsuite>\n');
        });
        result.push('</testsuite>\n');
        return result.join('');
    }

    // #### Callback function accumulating test results
    return function(msg) {
        var xml;
        console.log(JSON.stringify([filename, (new Date()).getTime(), msg]));
        if (msg.testsuite) {
            suite = msg.testsuite;
            results[suite] = results[suite] || {};
        }
        if (msg.testcase) {
            errorDetected = false;
            testcase = msg.testcase;
            results[suite][testcase] = results[suite][testcase] || [];
        }
        if (msg.error) {
            results[suite][testcase].push(msg);
            if (!errorDetected) {
                errorCount++;
                errorDetected = true;
            }
        }
        // Exit with error code when all JunitReporters are done.
        if (msg.testDone) {
            xml = results2xml(errorCount);
            grunt.file.write(filename, xml);
        }
    };
};