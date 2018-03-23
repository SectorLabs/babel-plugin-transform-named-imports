const path = require('path');
const pluginTester = require('babel-plugin-tester');
const createBabylonOptions = require('babylon-options');

const plugin = require('../src/index.js');

const babelOptions = {
    filename: 'currentFile.js',
    parserOpts: createBabylonOptions({
        stage: 2
    })
};

pluginTester({
    plugin,
    babelOptions: babelOptions,
    pluginOptions: {
        webpackConfig: path.resolve(__dirname + '/webpack.config.js'),
    },
    snapshot: true,
    tests: {
        // convert this into a default import that leads to `testmodule/myFunc`
        'single named import':
            `import { myFunc } from 'testmodule'`,

        // convert this into named import that leads to `testmodule/myOtherFunc`
        'nested named import':
            `import { myOtherFunc } from 'testmodule'`,

        // convert this into one default import that leads to `testmodule/myFunc`
        // and a named import that leads to `testmodule/myOtherFunc`
        'multiple named imports':
            `import { myFunc, myOtherFunc } from 'testmodule'`,

        // convert this into three imports, one default import for `init` and
        // one default import for `myFunc` and a named one for `myOtherFunc`
        'default import with multiple named import':
            `import init, { myFunc, myOtherFunc } from 'testmodule'`,

        // convert this into a default import with `myAliasFunc` leading to
        // `testmodule/myFunc`
        'aliased named import':
            `import { myFunc as myAliasFunc } from 'testmodule'`,

        // don't change existing default imports like this
        'default import':
            `import myFunc from 'testmodule/myFunc'`,

        // unresolved default imports should be left alone
        'unresolved default import':
            `import React from 'reacty'`,

        // unresolved imports should be left alone
        'unresolved default import with named import':
            `import React, { Component } from 'reacty'`,

        // common js imports should be left alone
        'common js default import':
            `import React from './commonjsmodule'`,

        // common js imports should be left alone
        'common js default with named import':
            `import React, { Component } from './commonjsmodule'`,

        // convert this into a namespace import that leads to `testmodule/constants`
        'aliased namespace import':
            `import { thangs } from 'testmodule'`,

        // leaves glob imports alone
        'glob import':
            `import * as testmodule from 'testmodule'`,
    },
});
