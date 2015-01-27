module.exports = function (grunt) {
    grunt.initConfig({
        // Check code for mistakes or errors.
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        // Before generating any new files, remove any previously-created files.
        clean: {
            generated: ['test/generated']
        },
        moonwalker: {
            success: {
                src: [
                    'tests/fixtures/SeleneseSearchSuccess'
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
                    reporter: ['junit', 'tests/generated/success/junit_report.xml']
                }
            },
            error: {
                src: [
                    'tests/fixtures/SeleneseSearch'
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
                    reporter: ['junit', 'tests/generated/error/junit_report.xml']
                }
            },
            all: {
                src: [ 'tests/fixtures/**'],
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
                    reporter: ['junit', 'tests/generated/all/junit_report.xml']
                }
            }
        },
        // Unit tests.
        nodeunit: {
            tests: ['tests/*_test.js']
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('test', ['jshint', 'clean', 'moonwalker:error', 'moonwalker:success', 'moonwalker:all', 'nodeunit']);

    grunt.registerTask('default', ['test']);
};