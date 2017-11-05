const fs = require('fs');
const ospath = require('path');

const Babylon = require('babylon');
const types = require('babel-types');
const resolver = require('eslint-import-resolver-webpack');

const AST = require('./ast');
const Resolver = require('./resolver');
const extractImportSpecifiers = require('./extractImportSpecifiers');

const visitor = (path, state) => {
    const webpackConfig = require('path').resolve(state.opts.webpackConfig || './webpack.config.js');
    const webpackConfigIndex = state.opts.webpackConfigIndex || 0;

    const resolver = new Resolver(webpackConfig, webpackConfigIndex);

    const sourcePath = state.file.opts.filename;
    const specifiers = extractImportSpecifiers(
        [path.node], path => resolver.resolveFile(path, sourcePath));

    const transforms = [];

    specifiers.forEach((specifier) => {
        // attempt to parse the file that is being imported
        const ast = AST.parseFrom(specifier.path, resolver);
        if (!ast) {
            return;
        }

        // attempt to find an export that matches our import
        const exportedSpecifier = ast.importSpecifiers().find(spec => spec.name === specifier.name);
        if (!exportedSpecifier) {
            return;
        }

        // found it, replace our import with a new one that imports
        // straight from the place where it was exported....

        const relativePath = './' + ospath.relative(
            ospath.dirname(sourcePath), exportedSpecifier.path);

        switch (exportedSpecifier.type) {
        case 'default':
            transforms.push(types.importDeclaration(
                [types.importDefaultSpecifier(
                    types.identifier(specifier.name)
                )],
                types.stringLiteral(relativePath),
            ));
            break;

        case 'named':
            transforms.push(types.importDeclaration(
                [types.importSpecifier(
                    types.identifier(specifier.name),
                    types.identifier(exportedSpecifier.name),
                )],
                types.stringLiteral(relativePath),
            ));
            break;
        }
    });

    if (transforms.length > 0) {
        path.replaceWithMultiple(transforms);
    }
};

module.exports = {
    name: 'transform-named-exports',
    visitor: {
        ImportDeclaration: visitor,
    },
};
