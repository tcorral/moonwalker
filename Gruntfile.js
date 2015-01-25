module.exports = function (grunt) {
    grunt.initConfig({
        moonwalker: {
            error: {
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
            success: {
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
            }
        }
    });

    grunt.loadTasks('tasks');
    grunt.registerTask('test', ['moonwalker']);
};