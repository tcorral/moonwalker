# grunt-moonwalker

> Compiles and concatenates twig.js templates; currently, just for use in the browser.

[twig.js](https://github.com/justjohn/twig.js) does not yet have the ability to
compile templates to actual JavaScript code. It instead compiles templates into
data structures that it can easily use later to render the template with a
given data set (or "context").

Thus, your application will still need to load twig.js in order to use the
compiled templates.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-twig-i18n --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-twig-i18n');
```

## The "twig" task

### Overview
In your project's Gruntfile, add a section named `twig` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  twig: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.translate
type: `boolean`

Default value: `true`

Determine whether is possible use or not the {% t %} inside of your tpls.
If you Enable this option, will be possible create template like the follow:

```html
<div>{% t %}Hello World{% endt %}</div>
```

```html
<div>{% t %}{{ greet }}{% endt %}</div>
```

```html
<div>{% t 1="World" %}Hello %1{% endt %}</div>
```

```html
<div>{% t 1="Milenio3" 2="Cuarto milenio" %}I Love %1 and %2{% endt %}</div>
```

```html
<div>{% t 1=world %}Hello %1{% endt %}</div>
```

```html
<div>{% t 1=world 2="genial" %}Hello %1, you look %2{% endt %}</div>
```

In the render time each time that twig found an expresion inside a {% t %} will be called `window.Namespace.utilities.i18n.getText()` with the string inside the tags. At the end what will be render, will be the response of this function.


#### options.amd_wrapper
Type: `boolean`

Default value: `true`

Determines whether the output will be wrapped in a `require(["twig"], ...)`
call.

#### options.variable
Type: `string`
Default value: `'JST'`

The name of the global variable that should store all the templates.

#### options.separator
Type: `string`

Default value: `';\n'`

A string that is inserted between each compiled template when
concatenating templates.

#### options.template
Type: `string`
Default value: `'{{ variable }} = {{ variable }} || {};\n{{
templates }}\n'`

A Twig template used to render the result of the grunt-twig task.
Variables available:

* variable (string): JST array variable name (options.variable).
* templates (string): All compiled templates.

#### options.each_template
Type: `string`
Default value: `'{{ variable }}["{{ filepath }}"] = Twig.twig({
data: {{ compiled }} });'`

A Twig template used to render each compiled template.
Variables available:

* variable (string): JST array variable name (options.variable).
* filepath (string): Filename of the template as declared in options.
* compiled (string): twig.js's data structure (JSON) of tokens
  resulting from compiling the template.

#### options.template_key
Type: `function(string) -> string`
Default value: `function(path) { return path; }`

A function used to create a template hash key from a template's path.
This determines where the template is found in the resulting template
hash; e.g., `window.JST['templates/list.html.twig']` vs
`window.JST['list.html.twig']`.

### Usage Examples

#### Default Options
In this example, the default options are used to compile two simple templates.

```js
grunt.initConfig({
  twig: {
    build_target: {
      files: {
        'dest/my-compiled-templates.js': [
          'templates/testing.twig',
          'templates/hello.twig'
        ]
      }
    }
  }
})
```

If the `testing.twig` file has the content `Testing` and the `hello.twig` file
has the content `Hello, {{ name }}`, the generated result would be something
like:

```js
require(["twig"], function(Twig) {
window.JST = window.JST || {};
window.JST["testing.twig"] = Twig.twig({ data: [{"type":"raw","value":"Testing\n"}] });
window.JST["hello.twig"] = Twig.twig({ data: [{"type":"raw","value":"Hello, "},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"name","match":["name"]}]},{"type":"raw","value":"\n"}] });
});
```

#### The variable Option
In this example, the variable option is used to customize the name of the array that the compiled templates will be stored in.

```js
grunt.initConfig({
  twig: {
    options: {
      variable: 'myTemplates'
    },
    my_target: {
      files: {
        'dest/my-compiled-templates.js': [
          'templates/testing.twig',
          'templates/hello.twig'
        ]
      }
    }
  }
})
```

In this case, the resulting file, `dest/my-compiled-templates.js` will look
something like:

```js
require(["twig"], function(Twig) {
myTemplates = myTemplates || {};
myTemplates["testing.twig"] = Twig.twig({ data: [{"type":"raw","value":"Testing\n"}] });
myTemplates["hello.twig"] = Twig.twig({ data: [{"type":"raw","value":"Hello, "},{"type":"output","stack":[{"type":"Twig.expression.type.variable","value":"name","match":["name"]}]},{"type":"raw","value":"\n"}] });
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* 0.1.1: Added template_key option.
