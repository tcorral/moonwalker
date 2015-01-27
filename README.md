# moonwalker

> Tool to launch Selenium IDE HTML files tests

Moonwalker is a tool to execute Selenium IDE tests aka.Selenese tests.

## Install

```shell
npm install moonwalker --save
```

### Overview
Moonwalker needs a Selenium server, standalone or grid, running to execute the tests, it will need to have installed the browsers you expect to launch.
If you want to execute the tests using Phantomjs you will need to execute GhostDriver server too.

### API
Moonwalker consists of one api exposing two different elements:

- reporters
- launcher

#### reporters
type: `Object`
Is an object that contains the available reporters that could be used in Moonwalker, now by default we have added the junit reporter.
To call the junit reporter you just need to call `moonwalker.reporters.junit`

#### launcher
type: `Function`
Is the function that will read and execute the Selenese tests. The following section explains the arguments needed to execute it properly.

##### Arguments

###### filepaths
type: `Array`
Required

This array is an array with the paths to all the Selenese test files.

Example:

```js
[ 'path/to/my/selenese/tests/test1', 'path/to/my/selenese/tests/test2' ]
```

###### options
type: `Object`
Required

This configuration object is used to setup the environment where the test will be executed and needs at least...

- selenium `Object`
  - The host where is running the Selenium Server. `String`
  - The port where is running the Selenium Server. `Number`
- desiredCapabilities
  - The [desired capabilities](https://code.google.com/p/selenium/wiki/DesiredCapabilities) where you want to execute the tests. `Array<Object>`

Example:

```js
{
  selenium: {
    host: 'localhost',
    port: 4444
  },
  desiredCapabilities: [
    { browserName: 'chrome' }
  ]
}
```

##### reporter
type: `function`
Required

The reporter is a function that will log the info messages and that could perform especial actions to report the result of the tests.
See `reporters` section for more information.

##### done
type: `function`
Required

The done function is a function that will be executed when all the tests are executed.

### Usage Examples

#### Default Options
In this example, the default options are used to compile two simple templates.

```js
moonwalker.launcher(  ['path/to/selenese/tests/test1'],
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
                      moonwalker.reporters.junit('path/to/reports/junit_report.xml'),
                      function (){
                        console.log('Tests finished');
                      });
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* 0.1.1: First release.
