var fs = require('fs');
var converter = require('selenium-html-js-converter');
var wdSync = require('wd-sync');
var temp = require('temp');
var path = require('path');
//var getFormattedError = require('../lib/error');

// Remove the temporary files when the task has finished.
temp.track();

module.exports = function (grunt){
    grunt.registerMultiTask('moonwalker', 'Tool to launch Selenium IDE HTML files tests', function (){
        var done = this.async();
        var reporter;
        var options = this.options({
            selenium: {
                host: 'localhost',
                port: 4444
            },
            desiredCapabilities: [
                {
                    browserName: 'firefox'
                }
            ],
            reporter: false
        });
        if(options.reporter){
            if(typeof options.reporter === 'function'){
                reporter = options.reporter;
            }else{
                reporter = require('../lib/reporters/' + options.reporter[0])(options.reporter[1]);
            }
        }else{
            reporter = console.log;
        }
        var sessions = { length: 0 };
        var errors = [];
        this.files.forEach(function (file){
            var lenFiles = file.src.length;
            var maxSessions = lenFiles * options.desiredCapabilities.length;
            file.src.forEach(function (filepath){
                var suiteName = path.basename(filepath);
                console.log(filepath);
                temp.open('moonwalker_', function (err, info){
                    if(!err){
                        reporter({info: 'loading suitelist', url: filepath});
                        fs.readFile(filepath, 'utf-8', function (err, data){
                            var jsFileContent;
                            try{
                                jsFileContent = converter.convertHtmlStrToJsStr(data, suiteName);
                                reporter({info: 'loading testsuite', url: filepath});
                            }catch(er){
                                reporter({
                                    testcase: 'error-before-testcase-reached'});
                                reporter({
                                    error: "Testsuite doesn't look like a testsuite-" +
                                    "file from selenium-IDE. Check that the " +
                                    "url actually exists",
                                    url: suiteName
                                });
                            }
                            fs.writeFile(info.path, jsFileContent, function (){
                                var jsTest = require(info.path);
                                options.desiredCapabilities.forEach(function (capability){
                                    var host = options.selenium.host;
                                    var port = options.selenium.port;
                                    var slUsername;
                                    var slAccessKey;
                                    var remoteConfig;
                                    var client;
                                    var sync;
                                    var error;
                                    // If we want to use phantomjs we need to change their host and port
                                    // and we need to start GhostDriver
                                    if(capability.browserName === 'phantomjs'){
                                        if(options.phantomjs){
                                            host = options.phantomjs.host || 'localhost';
                                            port = options.phantomjs.port || 8910;
                                        }else{
                                            host = 'localhost';
                                            port = 8910;
                                        }
                                    }
                                    remoteConfig = [host, port];

                                    // Accept configuration for saucelabs execution tests.
                                    if(options.saucelabs){
                                        host = options.saucelabs.host || 'ondemand.saucelabs.com';
                                        port = options.saucelab.port || 80;
                                        slUsername = options.saucelabs.username;
                                        slAccessKey = options.saucelabs.accesskey;
                                        remoteConfig = [host, port, slUsername, slAccessKey];
                                    }

                                    client = wdSync.remote.apply(wdSync, remoteConfig);
                                    sync = client.sync;
                                    sync(function (){
                                        var sessionId;
                                        var browser = client.browser;
                                        reporter({info: 'starting new browser-session'});
                                        browser.init(capability);
                                        sessionId = browser.getSessionId();
                                        if(!sessionId){
                                            return reporter({
                                                error: "Internal error, could not start browser",
                                                err: err,
                                                testDone: true});
                                        }
                                        reporter({sid: sessionId});
                                        sessions['_' + sessionId] = browser;
                                        sessions.length++;
                                        console.log('session id:', sessionId, 'browser:', capability.browserName, 'test:', suiteName);
                                        try{
                                            reporter({testsuite: suiteName});
                                            reporter({info: 'loading testsuite', url: suiteName});
                                            reporter({testcase: suiteName});
                                            jsTest(browser);
                                        }catch(er){
                                            error = 'The test ' + suiteName + ' in ' + capability.browserName + ' with sessionId [' + sessionId  + '] has failed due to: ' + er.message;
                                            reporter({ error: error});
                                            errors.push(error)
                                            grunt.verbose.error(error);
                                            sessions['_' + sessionId].quit();
                                            delete sessions['_' + sessionId];
                                        }
                                        if(sessions.length === maxSessions){
                                            for(var key in sessions){
                                                if(sessions.hasOwnProperty(key) && key !== 'length'){
                                                    sessions[key].quit();
                                                }
                                            }
                                            sessions.length = 0;
                                            reporter({testDone: true});
                                            done();
                                            //if(errors.length === 0){
                                            //    reporter({testDone: true});
                                            //    done();
                                            //}else{
                                            //    grunt.fatal(getFormattedError(errors) + '\r\n' + JSON.stringify(errors, null, '\t'));
                                            //}
                                        }
                                    });
                                });
                            });
                        });
                    }
                });
            });
        });
    });
};