# babel-plugin-transform-named-imports

This plugin attempts to transform named ES6 imports to default imports:

    // from this
    import { myFunc } from 'mymodule';

    // to this
    import myFunc from 'node_modules/mymodule/myFunc';

## Why?
When you use a named export, Webpack actually pulls in the entire module. It should tree shake the things you don't actually use, leaving you with only what you actually use.

Unfortunately, Webpack often decides not to remove something because of potential side effects. By always importing by the full path, you could avoid accidentely pulling in a large module. This would make importing very cumbersome and you'd have to make sure to always import by the full path.

This plugin attempts to rewrite your named imports and turn them into full path imports, thus avoiding pulling in the entire module. This should leave you with a smaller bundle, yet be able to enjoy named imports.

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

## Limitations
* Heavily dependent on Webpack2.

    Your Webpack configuration is used to actually resolve imports and figure out the full path.

* Slow-ish

    Once we figured out the absolute path to the module you're importing from, we have to parse it and figure out where its importing the identifier from you're trying to import. This sometimes means parsing multiple files on the spot until we find the file in which the identifier you're importing was declared.

* Transforms ES6 imports only.
