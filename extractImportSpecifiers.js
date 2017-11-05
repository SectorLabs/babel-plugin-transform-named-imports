module.exports = (declarations, resolve) => {
    const imports = [];

    declarations.forEach(importNode => {
        const importPath = resolve(importNode.source.value);
        const specifiers = importNode.specifiers;

        importNode.specifiers.forEach(specifier => {
            imports.push({
                type: specifier.type === 'ImportDefaultSpecifier'
                    ? 'default' : 'named',
                path: importPath,
                name: specifier.local.name,
            });
        });
    });

    return imports;
};
