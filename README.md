# babel-plugin-transform-named-imports

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/hyperium/hyper/master/LICENSE)
[![npm version](https://badge.fury.io/js/babel-plugin-transform-named-imports.svg)](https://badge.fury.io/js/babel-plugin-transform-named-imports)
[![Build Status](https://scrutinizer-ci.com/g/SectorLabs/babel-plugin-transform-named-imports/badges/build.png?b=master)](https://scrutinizer-ci.com/g/SectorLabs/babel-plugin-transform-named-imports/build-status/master)
[![Code Coverage](https://scrutinizer-ci.com/g/SectorLabs/babel-plugin-transform-named-imports/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/SectorLabs/babel-plugin-transform-named-imports/?branch=master)

This plugin attempts to transform named ES6 imports to default imports:

    // from this
    import { myFunc } from 'mymodule';

    // to this
    import myFunc from 'node_modules/mymodule/myFunc';

The former causes `mymodule/index.js` to be imported, and therefor all other classes and methods to be imported as well. By transforming the import, tree shaking is far more effective and you can be assured that code that you're not using does not end up in your bundle.

## Warning
This plugin aggressively transforms all imports thay pass to Babel. If you have any `index.js` files that have side effects, i.e code that executes on import, do not use this plugin. That code will never make it into your bundle with this plugin. To be on the safe side, do not run your `node_modules` through Babel. It might cause problems will libraries that rely on the behavior described above.

This is not a silver bullet. If your code does not rely on side effects, then you can expect this plugin to work well. If you do have code with side effects, then we strongly recommend that you do not use this plugin.

## Why?
When you use a named export, Webpack actually pulls in the entire module. It should tree shake the things you don't actually use, leaving you with only what you actually use.

Unfortunately, Webpack often decides not to remove something because of potential side effects. By always importing from the file the function/class was declared in, you could avoid accidentely pulling in a large module. This would make importing very cumbersome.

This plugin attempts to rewrite your imports to always import from the file in which the function/class was declared in.

## Installation
1. Install the package from NPM:

        yarn add --dev babel-plugin-transform-named-imports

2. Add `transform-named-imports` to your Babel configuration:

        "plugins": [
            "transform-named-imports": {
                "webpackConfig": "./webpack.config.js",
                "webpackConfigIndex": 0
            }
        ]

## Workings
1. Given a file that looks like this:

        import { myFunc } from 'myModule';

1. For every import statement, resolve the full path to `mymodule` and parse the file:

        import myFunc from './myFunc';

        export { myFunc };

2. Analyze the imports/exports in the resolved file and keep recursing until the file is found in which `myFunc` was declared.

3. Rewrite the original import to lead to the file in which `myFunc` was declared:

        import myFunc from 'node_modules/mymodule/myFunc.js';

## FAQ
1. **Why is my webpack configuration required?**

    In order for the plugin to find the file in which a function/class was declared, the plugin has to resolve imports. Babel itself doesn't concern itself with importing, just rewriting code. Your webpack configuration is required so the plugin can resolve paths exactly how they're supposed to be resolved.

2. **Does this handle aliases?**

    Yes.

3. **Can I exclude certain paths?**

    No.

4. **Does it transform CommonJS imports?**

    No.

5. **Is it safe to run on any code base?**

    There could be side-effects. If you're relying on a `index.js` being imported and executed, then this might screw that behavior. It could also be that there are third-party packages which this does not play nice with. If you have a reasonably clean code base that doesn't do anything out of the ordinay and doesn't pass `node_modules` through Babel, then this plugin will most likely work for you.

6. **By how much will it decrease my bundle size?**

    This highly depends on how large the modules are you are importing from and how much of it you actually use. The improvements are more visible in code bases that split their bundle into chunks or have multiple endpoints.

## Thanks
Thanks to the author of [babel-plugin-transform-imports](https://www.npmjs.com/package/babel-plugin-transform-imports) for the initial idea of rewriting the imports.

The major difference with `babel-plugin-transform-imports` is that it requires defining every module you want rewritten. This plugin goes a step further and rewrites all your imports.
