module.exports = function (grunt) {
    grunt.initConfig({
        moonwalker: {
            success: {
                src: [
                    'tests/SeleneseSearchSuccess'
                ],
                filter: 'isFile',
                options: {
                    selenium: {
                        host: 'localhost',
                        port: 4444
                    },
                    desiredCapabilities: [
                        {
                            browserName: 'firefox'
                        }
                    ],
                    reporter: ['junit', 'tests/junit_report.xml']
                }
            },
            error: {
                src: [
                    'tests/SeleneseSearch'
                ],
                filter: 'isFile',
                options: {
                    selenium: {
                        host: 'localhost',
                        port: 4444
                    },
                    desiredCapabilities: [
                        {
                            browserName: 'firefox'
                        }
                    ],
                    reporter: ['junit', 'tests/junit_report.xml']
                }
            },
            all: {
                src: [ 'tests/**'],
                filter: 'isFile',
                options: {
                    selenium: {
                        host: 'localhost',
                        port: 4444
                    },
                    desiredCapabilities: [
                        {
                            browserName: 'firefox'
                        }
                    ],
                    reporter: ['junit', 'tests/junit_report.xml']
                }
            }
        }
    });

    grunt.loadTasks('tasks');
    grunt.registerTask('test', ['moonwalker:error']);
};