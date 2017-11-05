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
    plugin: () => plugin,
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
        // BROKEN
        'aliased named import':
            `import { myFunc as myAliasFunc } from 'testmodule'`,

        // don't change existing default imports like this
        'default import':
            `import myFunc from 'testmodule/myFunc'`,
    },
});
