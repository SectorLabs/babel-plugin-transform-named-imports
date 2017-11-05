# babel-plugin-transform-named-imports

[![npm version](https://badge.fury.io/js/%40sector-labs%2Fbabel-plugin-transform-named-imports.svg)](https://badge.fury.io/js/%40sector-labs%2Fbabel-plugin-transform-named-imports)

This plugin attempts to transform named ES6 imports to default imports:

    // from this
    import { myFunc } from 'mymodule';

    // to this
    import myFunc from 'node_modules/mymodule/myFunc';

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

## Thanks
Thanks to the author of [babel-plugin-transform-imports](https://www.npmjs.com/package/babel-plugin-transform-imports) for the initial idea of rewriting the imports.

The major difference with `babel-plugin-transform-imports` is that it requires defining every module you want rewritten. This plugin goes a step further and rewrites all your imports.
