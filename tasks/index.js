var fs = require('fs');
var converter = require('selenium-html-js-converter');
var wdSync = require('wd-sync');
var temp = require('temp');
var path = require('path');

// Remove the temporary files when the task has finished.
temp.track();

module.exports = function (grunt){
    grunt.registerMultiTask('moonwalker', 'Tool to read Selenium IDE HTML files and launch them', function (){
        var done = this.async();
        var options = this.options({
            selenium: {
                host: 'localhost',
                port: 4444
            },
            desiredCapabilities: [
                {
                    browserName: 'firefox'
                }
            ]
        });
        var sessions = { length: 0 };
        var errors = [];
        this.files.forEach(function (file){
            var maxSessions = file.src.length * options.desiredCapabilities.length;
            file.src.forEach(function (filepath){
                var suiteName = path.basename(filepath);
                temp.open('moonwalker_', function (err, info){
                    if(!err){
                        fs.readFile(filepath, 'utf-8', function (err, data){
                            var jsFileContent = converter.convertHtmlStrToJsStr(data, suiteName);
                            fs.writeFile(info.path, jsFileContent, function (){
                                var jsTest = require(info.path);
                                options.desiredCapabilities.forEach(function (capability){
                                    var host = options.selenium.host;
                                    var port = options.selenium.port;
                                    var client;
                                    var sync;
                                    var error;
                                    if(capability.browserName === 'phantomjs'){
                                        if(options.phantomjs){
                                            host = options.phantomjs.host || 'localhost';
                                            port = options.phantomjs.port || 8910;
                                        }else{
                                            host = 'localhost';
                                            port = 8910;
                                        }
                                    }
                                    client = wdSync.remote(host, port);
                                    sync = client.sync;
                                    sync(function (){
                                        var sessionId;
                                        var browser = client.browser;
                                        browser.init(capability);
                                        sessionId = browser.getSessionId();
                                        sessions['_' + sessionId] = browser;
                                        sessions.length++;
                                        console.log('session id:', sessionId, 'browser:', capability.browserName, 'test:', suiteName);
                                        try{
                                            jsTest(browser);
                                        }catch(er){
                                            error = 'The test ' + suiteName + ' in ' + capability.browserName + ' with sessionId [' + sessionId  + '] has failed due to: ' + er.message;
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
                                            if(errors.length === 0){
                                                done();
                                            }else{
                                                error = ['There'];
                                                if(errors.length === 1){
                                                    error.push('is an error');
                                                }else{
                                                    error.push('are some errors');
                                                }
                                                error.push('launching your selenese test/s, please review');
                                                if(errors.length === 1){
                                                    error.push('it.');
                                                }else{
                                                    error.push('them.');
                                                }
                                                grunt.fatal(error.join(' ') + '\r\n' + JSON.stringify(errors, null, '\t'));
                                            }
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