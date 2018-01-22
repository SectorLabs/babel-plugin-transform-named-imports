const debug = require('debug')('transform-named-imports');
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

    const sourcePath = state.file.opts.filename;
    const resolver = new Resolver(webpackConfig, webpackConfigIndex);

    // skip imports we cannot resolve
    if (!resolver.resolveFile(path.node.source.value, sourcePath)) {
        return;
    }

    const specifiers = extractImportSpecifiers(
        [path.node], path => resolver.resolveFile(path, sourcePath));

    const transforms = [];

    // leave single, default imports alone
    if (specifiers.length === 1 && specifiers[0].type === 'default') {
        return;
    }

    // takes the specifier and builds the path, we prefer
    // the absolute path to the file, but if we weren't
    // able to resolve that, stick to the original path
    const makeImportPath = (specifier) => {
        if (!specifier.path) {
            return specifier.originalPath;
        }

        return './' + ospath.relative(
            ospath.dirname(sourcePath), specifier.path);
    };

    for (let i = 0; i < specifiers.length; ++i) {
        const specifier = specifiers[i];

        // default imports can usually not be further resolved,
        // bail out and leave it as is.. we do have to do a transform
        // because the same import line might also contain named imports
        // that get split over multiple lines
        if (specifier.type === 'default') {
            transforms.push(types.importDeclaration(
                [types.importDefaultSpecifier(
                    types.identifier(specifier.name)
                )],
                types.stringLiteral(makeImportPath(specifier)),
            ));

            continue;
        }

        let exportedSpecifier;
        let pointer;
        let iteration = 0;
        let path = specifier.path;
        let name = specifier.importedName;

        do {
            iteration += 1;

            // attempt to parse the file that is being imported
            const ast = AST.parseFrom(path, resolver);
            if (!ast) {
                return;
            }

            // attempt to find an export that matches our import
            debug('ITERATION', iteration);
            debug('LOOKING FOR', name);
            debug('IMPORTS', ast.importSpecifiers());
            debug('EXPORTS', ast.exportSpecifiers());

            pointer = ast.importSpecifiers().find(imp => imp.name === name);

            if (!pointer) {
                // perhaps there was a re-export, check the export specifiers
                pointer = ast.exportSpecifiers().find(exp => exp.exportedName === name);
                debug('FOUND IT!', pointer);

                if (pointer) {
                    // it was re-exported! find the matching local import
                    pointer = ast.importSpecifiers().find(imp => imp.name === pointer.name);

                    if (pointer) {
                        path = pointer.path;
                        name = pointer.importedName;

                        debug('FOUND THE RE-EXPORT!', pointer);

                        exportedSpecifier = pointer;
                        continue;
                    } else if (exportedSpecifier) {
                        // no matching import, we're at the bottom of the chain
                        debug('NO MORE IMPORTS, USE THE PREVIOUS RESULT');
                        break;
                    }
                }

                if (!pointer) {
                    return;
                } else {
                    exportedSpecifier = pointer;
                    break;
                }
            } else {
                exportedSpecifier = pointer;
                break;
            }
        } while (path);

        debug('GOING WITH', exportedSpecifier);

        // found it, replace our import with a new one that imports
        // straight from the place where it was exported....

        switch (exportedSpecifier.type) {
        case 'default':
            transforms.push(types.importDeclaration(
                [types.importDefaultSpecifier(
                    types.identifier(specifier.name)
                )],
                types.stringLiteral(makeImportPath(exportedSpecifier)),
            ));
            break;

        case 'named':
            transforms.push(types.importDeclaration(
                [types.importSpecifier(
                    types.identifier(specifier.name),
                    types.identifier(exportedSpecifier.name),
                )],
                types.stringLiteral(makeImportPath(exportedSpecifier)),
            ));
            break;
        }
    }

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
