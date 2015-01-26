var fs = require('fs');
var escapeXML = require('../../xml/escape/index');
// ## JUnit-compatible reporting callback

// ### Static variables
// Several junit-reporters can be active at once, - there will typically be one per testcollection run by `runWithConfig`.
// when the last report quits, the program exits with the total `errorCount` as exit code.
// `junitReporters` keeps track of the number of running `junitReporter`s
var junitReporters = 0;
var errorCount = 0;

// ### The reporting function generator
// The function itself create a new reporting function, which will write the testreport in a given `filename`.
module.exports = function(filename) {
    ++junitReporters;

    // During the execution it keeps track of the current `suite`-name and `testcase`, and then record the testresult in the `results`-object. `errorDetected` keeps track that we only report one error per testcase, even if there are several failures.
    var suite, testcase;
    var results = {};
    var errorDetected = false;

    // #### Generate xml report
    // Transform to junit-like xml for Jenkins
    function results2xml() {
        var result = ['<testsuite name="root">'];
        console.log(results);
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
            console.log('This is an error');
            results[suite][testcase].push(msg);
            if (!errorDetected) {
                errorCount++;
                errorDetected = true;
            }
        }
        // Exit with error code when all JunitReporters are done.
        if (msg.testDone) {
            console.log('----', results, errorCount);
            xml = results2xml();
            fs.writeFile(filename, xml, function() {
                --junitReporters;
                if (junitReporters === 0) {
                    process.exit(errorCount);
                }
            });
        }
    };
};