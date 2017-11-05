const path = require('path');

const resolver = require('eslint-import-resolver-webpack');

/**
 * Resolves the absolute path to a file using Webpack's resolver.
 */
class Resolver {
    /**
     * Initializes a new instance of {@see Resolver}.
     * @param webpackConfig Path to the webpack configuration file to use.
     * @param webpackConfigIndex The index of the configuration to use in
     * case the specified configuration file is a multi-config file.
     */
    constructor(webpackConfig, webpackConfigIndex = 0) {
        this.webpackConfig = path.resolve(webpackConfig);
        this.webpackConfigIndex = webpackConfigIndex;
    }

    /**
     * Resolves the absolute path to the specified path.
     * @param importPath The path to resolve.
     * @param source The path to make the import relative to.
     * @returns The absolute path to the specified {@param importPath}
     * or null if the file could not be resolved.
     */
    resolveFile(importPath, source) {
        const result = resolver.resolve(
            importPath,
            source,
            {
                config: this.webpackConfig,
                'config-index': this.webpackConfigIndex,
            },
        );

        if (!result.found) {
            return null;
        }

        return result.path;
    }
}

module.exports = Resolver;
