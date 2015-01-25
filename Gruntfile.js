module.exports = function (grunt) {
    grunt.initConfig({
        moonwalker: {
            success: {
                src: [
                    'tests/SeleneseSearchSuccess'
                ],
                options: {
                    selenium: {
                        host: 'localhost',
                        port: 4444
                    },
                    desiredCapabilities: [
                        {
                            browserName: 'firefox'
                        }
                    ]
                }
            },
            error: {
                src: [
                    'tests/SeleneseSearch'
                ],
                options: {
                    selenium: {
                        host: 'localhost',
                        port: 4444
                    },
                    desiredCapabilities: [
                        {
                            browserName: 'firefox'
                        }
                    ]
                }
            },
            all: {
                src: [ 'tests/**'],
                options: {
                    selenium: {
                        host: 'localhost',
                        port: 4444
                    },
                    desiredCapabilities: [
                        {
                            browserName: 'firefox'
                        }
                    ]
                }
            },
        }
    });

    grunt.loadTasks('tasks');
    grunt.registerTask('test', ['moonwalker']);
};