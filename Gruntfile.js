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
                    ]
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
                    ]
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
                    ]
                }
            },
        }
    });

    grunt.loadTasks('tasks');
    grunt.registerTask('test', ['moonwalker:all']);
};